import { Alert } from 'react-bootstrap';

interface thunkError {
  name?: string;
  message?: string;
  stack?: string;
  code?: string;
}

interface MessageProps {
  variant?: string;
  errorMsg?: thunkError;
  text?: string;
  children?: JSX.Element;
}

const Message = ({ variant, errorMsg, text, children }: MessageProps) => {
  return (
    <Alert variant={variant}>
      {errorMsg?.message} {text} {children}
    </Alert>
  );
};
Message.defaultProps = {
  variant: 'info',
};
export default Message;
