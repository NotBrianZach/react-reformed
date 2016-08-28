import React from 'react';
import assign from 'object-assign';
import hoistNonReactStatics from 'hoist-non-react-statics';
import getComponentName from './_internal/getComponentName';

const makeWrapper = (middleware) => (WrappedComponent) => {
  class FormWrapper extends React.Component {
    static propTypes = {
      initialModel: React.PropTypes.object,
    }

    constructor (props, ctx) {
      super(props, ctx);
      this.state = {
        model: props.initialModel || {},
        isModelModified: props.isModelModified || false,
      };
    }

    setModel = (model) => {
      this.setState({ model });
      return model;
    }

    setProperty = (prop, value) => {
      return this.setModel(assign({}, this.state.model, {
        [prop]: value,
      }));
    }

    // This, of course, does not handle all possible inputs. In such cases,
    // you should just use `setProperty` or `setModel`. Or, better yet,
    // extend `reformed` to supply the bindings that match your needs.
    bindToChangeEvent = (e) => {
      const { checked, name, type, value } = e.target;

      if (type === 'checkbox') {
        const oldCheckboxValue = this.state.model[name] || [];
        const newCheckboxValue = e.target.checked
          ? oldCheckboxValue.concat(value)
          : oldCheckboxValue.filter(v => v !== value);

        this.setProperty(name, newCheckboxValue);
      }
      else {
        this.setProperty(name, value);
      }
    }

    bindInput = (name) => {
      return {
        name,
        value: this.state.model[name],
        onChange: this.bindToChangeEvent,
      };
    }

    bindSelectInput = (name, values) => {
      return {
        name,
        value: this.state.model[name],
        onChange: this.bindToChangeEvent,
      };
    }

    bindToRadioChangeEvent = (e) => {
      const { checked, name, type, value } = e.target
      if (type === 'radio') {
        this.state.model[name].forEach((val) => {
          this.setProperty(name + value, false);
        });
        this.setProperty(name + value, true);
      }
      else {
        throw('Error, bindToRadioChangeEvent should only be used on radio inputs');
      }
    }

    bindRadioInput = (name, value) => {
      return {
        name: [...this.state.model[name], value],
        checked: this.state.model[name + value],
        onChange: this.bindToRadioChangeEvent,
      }
    }

    render () {
      const nextProps = assign({}, this.props, {
        bindInput: this.bindInput,
        bindToChangeEvent: this.bindToChangeEvent,
        bindRadioInput: this.bindInput,
        bindToRadioChangeEvent: this.bindToChangeEvent,
        model: this.state.model,
        setProperty: this.setProperty,
        setModel: this.setModel,
      })
      // SIDE EFFECT-ABLE. Just for developer convenience and experimentation.
      const finalProps = typeof middleware === 'function'
        ? middleware(nextProps)
        : nextProps

      return React.createElement(WrappedComponent, finalProps)
    }
  };

  FormWrapper.displayName = `Reformed(${getComponentName(WrappedComponent)})`;
  return hoistNonReactStatics(FormWrapper, WrappedComponent);
}

export default makeWrapper;
