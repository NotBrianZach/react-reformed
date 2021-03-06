import React from 'react';
import assign from 'object-assign';
import hoistNonReactStatics from 'hoist-non-react-statics';
import getComponentName from './_internal/getComponentName';

const getValidationErrors = (schema, model) => Object.keys(schema).reduce((acc, key) => {
  const errors = [];
  const value = model[key];
  const rules = schema[key];

  if (rules.required && !value) {
    errors.push(`${key} is required`);
  }
  if (rules.type && typeof value !== rules.type) {
    errors.push(`${key} must be of type ${rules.type}, but got ${typeof value}`);
  }
  if (rules.minLength) {
    if (!value || value.length < rules.minLength) {
      errors.push(`${key} must have at least ${rules.minLength} characters`);
    }
  }
  if (rules.maxLength) {
    if (value && value.length > rules.maxLength) {
      errors.push(`${key} must not have more than ${rules.maxLength} characters`);
    }
  }
  if (rules.asyncTest) {
    // rules.asyncTest is assumed to be , resolve and reject
    let error;
    let asyncTestPromise = new Promise((accept) => {
      rules.asyncTest(value, error);
    });
    if (error) errors.push(error);
  }
  if (rules.test) {
    let error;
    rules.test(value, (msg) => {
      error = msg;
    })
    if (error) {
      errors.push(error);
    }
  }

  return assign({}, acc, {
    isValid: !errors.length && acc.isValid,
    fields: Object.assign({}, acc.fields, {
      [key]: {
        isValid: !errors.length,
        errors
      }
    })
  })
}, { isValid: true, fields: {} });

const validateSchema = (schema) => (WrappedComponent) => {
  const validated = (props) => {
    let validationErrors;
    if (typeof props.validationSchema !== 'undefined'){
      validationErrors = getValidationErrors(props.validationSchema, props.model);
    }
    else {
      validationErrors = getValidationErrors(schema, props.model);
    }

    return React.createElement(WrappedComponent, assign({}, props, {
      schema: validationErrors,
    }));
  }
  validated.displayName = `ValidateSchema(${getComponentName(WrappedComponent)})`;
  return hoistNonReactStatics(validated, WrappedComponent);
}

export default validateSchema;
