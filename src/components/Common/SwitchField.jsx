import { Form } from 'react-bootstrap';

const SwitchField = ({ 
  label,
  name,
  checked,
  onChange,
  disabled = false,
  className = '',
  size = '',
}) => {
  return (
    <Form.Group className={`mb-3 ${className}`}>
      <div className="d-flex align-items-center">
        <Form.Check
          type="switch"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`form-switch-${size}`}
        />
        {label && <Form.Label className="ms-2 mb-0">{label}</Form.Label>}
      </div>
    </Form.Group>
  );
};

export default SwitchField; 