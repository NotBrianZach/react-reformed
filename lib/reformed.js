'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _getComponentName = require('./_internal/getComponentName');

var _getComponentName2 = _interopRequireDefault(_getComponentName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var makeWrapper = function makeWrapper(middleware) {
  return function (WrappedComponent) {
    var FormWrapper = function (_React$Component) {
      _inherits(FormWrapper, _React$Component);

      function FormWrapper(props, ctx) {
        _classCallCheck(this, FormWrapper);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FormWrapper).call(this, props, ctx));

        _this.setModel = function (model) {
          _this.setState({ model: model });
          return model;
        };

        _this.setProperty = function (prop, value) {
          return _this.setModel((0, _objectAssign2.default)({}, _this.state.model, _defineProperty({}, prop, value)));
        };

        _this.bindToChangeEvent = function (e) {
          var _e$target = e.target;
          var checked = _e$target.checked;
          var name = _e$target.name;
          var type = _e$target.type;
          var value = _e$target.value;


          if (type === 'checkbox') {
            var oldCheckboxValue = _this.state.model[name] || [];
            var newCheckboxValue = e.target.checked ? oldCheckboxValue.concat(value) : oldCheckboxValue.filter(function (v) {
              return v !== value;
            });

            _this.setProperty(name, newCheckboxValue);
          } else {
            _this.setProperty(name, value);
          }
        };

        _this.bindInput = function (name) {
          return {
            name: name,
            value: _this.state.model[name],
            onChange: _this.bindToChangeEvent
          };
        };

        _this.bindToRadioChangeEvent = function (e) {
          var _e$target2 = e.target;
          var checked = _e$target2.checked;
          var name = _e$target2.name;
          var type = _e$target2.type;
          var value = _e$target2.value;

          if (type === 'radio') {
            _this.state.model[name].forEach(function (val) {
              _this.setProperty(name + value, false);
            });
            _this.setProperty(name + value, true);
          } else {
            console.log('Error, bindToRadioChangeEvent should only be used on radio inputs');
          }
        };

        _this.bindRadioInput = function (name, value) {
          return {
            name: [].concat(_toConsumableArray(_this.state.model[name]), [value]),
            checked: _this.state.model[name + value],
            onChange: _this.bindToRadioChangeEvent
          };
        };

        _this.state = {
          model: props.initialModel || {}
        };
        return _this;
      }

      // This, of course, does not handle all possible inputs. In such cases,
      // you should just use `setProperty` or `setModel`. Or, better yet,
      // extend `reformed` to supply the bindings that match your needs.


      _createClass(FormWrapper, [{
        key: 'render',
        value: function render() {
          var nextProps = (0, _objectAssign2.default)({}, this.props, {
            bindInput: this.bindInput,
            bindToChangeEvent: this.bindToChangeEvent,
            bindRadioInput: this.bindInput,
            bindToRadioChangeEvent: this.bindToChangeEvent,
            model: this.state.model,
            setProperty: this.setProperty,
            setModel: this.setModel
          });
          // SIDE EFFECT-ABLE. Just for developer convenience and expirementation.
          var finalProps = typeof middleware === 'function' ? middleware(nextProps) : nextProps;

          return _react2.default.createElement(WrappedComponent, finalProps);
        }
      }]);

      return FormWrapper;
    }(_react2.default.Component);

    FormWrapper.propTypes = {
      initialModel: _react2.default.PropTypes.object
    };
    ;

    FormWrapper.displayName = 'Reformed(' + (0, _getComponentName2.default)(WrappedComponent) + ')';
    return (0, _hoistNonReactStatics2.default)(FormWrapper, WrappedComponent);
  };
};

exports.default = makeWrapper;