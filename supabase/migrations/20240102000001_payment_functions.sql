-- Function to process successful payment atomically
CREATE OR REPLACE FUNCTION process_successful_payment(
  p_proposal_id UUID,
  p_request_id UUID,
  p_payment_intent_id TEXT,
  p_amount DECIMAL,
  p_student_fee DECIMAL,
  p_teacher_fee DECIMAL,
  p_platform_fee DECIMAL
) RETURNS VOID AS $$
BEGIN
  -- Update proposal status to accepted
  UPDATE proposals 
  SET 
    status = 'accepted',
    accepted_at = NOW(),
    payment_intent_id = p_payment_intent_id
  WHERE id = p_proposal_id;
  
  -- Update request status to in_progress
  UPDATE requests 
  SET status = 'in_progress'
  WHERE id = p_request_id;
  
  -- Reject all other proposals for this request
  UPDATE proposals 
  SET 
    status = 'rejected',
    rejected_at = NOW()
  WHERE request_id = p_request_id 
    AND id != p_proposal_id 
    AND status = 'pending';
  
  -- Create transaction record
  INSERT INTO transactions (
    proposal_id,
    request_id,
    student_id,
    teacher_id,
    amount,
    student_fee_amount,
    teacher_fee_amount,
    platform_fee_amount,
    payment_intent_id,
    status,
    created_at
  )
  SELECT 
    p.id,
    p.request_id,
    r.student_id,
    p.teacher_id,
    p_amount,
    p_student_fee,
    p_teacher_fee,
    p_platform_fee,
    p_payment_intent_id,
    'pending',
    NOW()
  FROM proposals p
  JOIN requests r ON r.id = p.request_id
  WHERE p.id = p_proposal_id;
  
END;
$$ LANGUAGE plpgsql;

-- Function to complete transaction (called when lesson is finished)
CREATE OR REPLACE FUNCTION complete_transaction(
  p_transaction_id UUID,
  p_completed_by UUID
) RETURNS VOID AS $$
DECLARE
  v_transaction transactions%ROWTYPE;
BEGIN
  -- Get transaction details
  SELECT * INTO v_transaction
  FROM transactions
  WHERE id = p_transaction_id AND status = 'pending';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Transaction not found or already completed';
  END IF;
  
  -- Verify completion authority (student or teacher)
  IF p_completed_by != v_transaction.student_id AND p_completed_by != v_transaction.teacher_id THEN
    RAISE EXCEPTION 'Unauthorized to complete transaction';
  END IF;
  
  -- Update transaction status
  UPDATE transactions 
  SET 
    status = 'completed',
    completed_at = NOW(),
    completed_by = p_completed_by
  WHERE id = p_transaction_id;
  
  -- Update request status
  UPDATE requests 
  SET status = 'completed'
  WHERE id = v_transaction.request_id;
  
END;
$$ LANGUAGE plpgsql;

-- Function to handle refunds
CREATE OR REPLACE FUNCTION process_refund(
  p_transaction_id UUID,
  p_refund_amount DECIMAL,
  p_reason TEXT DEFAULT NULL
) RETURNS VOID AS $$
DECLARE
  v_transaction transactions%ROWTYPE;
BEGIN
  -- Get transaction details
  SELECT * INTO v_transaction
  FROM transactions
  WHERE id = p_transaction_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Transaction not found';
  END IF;
  
  -- Create refund record
  INSERT INTO refunds (
    transaction_id,
    amount,
    reason,
    status,
    created_at
  ) VALUES (
    p_transaction_id,
    p_refund_amount,
    p_reason,
    'pending',
    NOW()
  );
  
  -- Update transaction status if full refund
  IF p_refund_amount >= v_transaction.student_fee_amount THEN
    UPDATE transactions 
    SET status = 'refunded'
    WHERE id = p_transaction_id;
    
    -- Update request status back to open
    UPDATE requests 
    SET status = 'open'
    WHERE id = v_transaction.request_id;
    
    -- Update proposal status back to pending
    UPDATE proposals 
    SET 
      status = 'pending',
      accepted_at = NULL
    WHERE id = v_transaction.proposal_id;
  END IF;
  
END;
$$ LANGUAGE plpgsql;

-- Add refunds table if not exists
CREATE TABLE IF NOT EXISTS refunds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID NOT NULL REFERENCES transactions(id),
  amount DECIMAL(10,2) NOT NULL,
  reason TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  stripe_refund_id TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for refunds
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own refunds"
  ON refunds FOR SELECT
  USING (
    transaction_id IN (
      SELECT id FROM transactions 
      WHERE student_id = auth.uid() OR teacher_id = auth.uid()
    )
  );

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_refunds_transaction_id ON refunds(transaction_id);
CREATE INDEX IF NOT EXISTS idx_refunds_status ON refunds(status);
CREATE INDEX IF NOT EXISTS idx_transactions_payment_intent ON transactions(payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_proposals_payment_intent ON proposals(payment_intent_id);