import Select from 'react-select';
import { Form } from 'react-bootstrap';

const SelectField = ({ 
  options, 
  value, 
  onChange, 
  label, 
  name, 
  isMulti = false,
  isSearchable = true,
  placeholder = 'Seçiniz',
  isClearable = true,
  isDisabled = false,
  error = null,
  className = '',
  styles = {}
}) => {
  
  // Eğer value boş ve options dizisi doluysa, null olarak ayarla
  const handleChange = (selectedOption) => {
    onChange(selectedOption);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: error ? '#dc3545' : provided.borderColor,
      boxShadow: error ? '0 0 0 0.25rem rgba(220, 53, 69, 0.25)' : provided.boxShadow,
      '&:hover': {
        borderColor: error ? '#dc3545' : provided.borderColor,
      },
      ...styles.control
    }),
    ...styles
  };

  return (
    <Form.Group className={`mb-3 ${className}`}>
      {label && <Form.Label>{label}</Form.Label>}
      <Select
        name={name}
        options={options}
        value={value}
        onChange={handleChange}
        isMulti={isMulti}
        isSearchable={isSearchable}
        placeholder={placeholder}
        isClearable={isClearable}
        isDisabled={isDisabled}
        styles={customStyles}
        classNamePrefix="react-select"
      />
      {error && <Form.Text className="text-danger">{error}</Form.Text>}
    </Form.Group>
  );
};

export default SelectField; 