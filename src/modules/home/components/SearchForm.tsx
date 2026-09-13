import React from 'react';
import FlightSearchForm, { FlightSearchFormProps } from '../../flights/components/FlightSearchForm';

export const SearchForm: React.FC<FlightSearchFormProps> = (props) => {
  return <FlightSearchForm {...props} />;
};

export default SearchForm;
