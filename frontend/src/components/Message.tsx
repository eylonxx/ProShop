import React from 'react';
import { Alert } from 'react-bootstrap';

interface thunkError {
  name?: string;
  message?: string;
  stack?: string;
  code?: string;
}

interface MessageProps {
  variant: string;
  children: thunkError;
}

const Message = ({ variant, children }: MessageProps) => {
  return <Alert variant={variant}>{children.message}</Alert>;
};
Message.defaultProps = {
  variant: 'info',
};
export default Message;
