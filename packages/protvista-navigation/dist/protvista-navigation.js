var ProtVistaNavigation = (function (d3) {
'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var height = 40;
var padding = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10
};

var ProtVistaNavigation$1 = function (_HTMLElement) {
  inherits(ProtVistaNavigation, _HTMLElement);

  function ProtVistaNavigation() {
    classCallCheck(this, ProtVistaNavigation);

    var _this = possibleConstructorReturn(this, (ProtVistaNavigation.__proto__ || Object.getPrototypeOf(ProtVistaNavigation)).call(this));

    _this._x = null;
    return _this;
  }

  createClass(ProtVistaNavigation, [{
    key: 'connectedCallback',
    value: function connectedCallback() {
      this.style.display = 'block';
      this.style.width = '100%';
      this.width = this.offsetWidth;

      this._length = parseFloat(this.getAttribute('length'));
      this._displaystart = parseFloat(this.getAttribute('displaystart')) || 1;
      this._displayend = parseFloat(this.getAttribute('displayend')) || this._length;
      this._highlightStart = parseFloat(this.getAttribute('highlightStart'));
      this._highlightEnd = parseFloat(this.getAttribute('highlightEnd'));

      this._createNavRuler();
    }
  }, {
    key: 'attributeChangedCallback',
    value: function attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        this['_' + name] = parseFloat(newValue);
        this._updateNavRuler();
      }
    }
  }, {
    key: '_createNavRuler',
    value: function _createNavRuler() {
      var _this2 = this;

      this._x = d3.scaleLinear().range([padding.left, this.width - padding.right]);
      this._x.domain([0, this._length + 1]);

      var svg = d3.select(this).append('div').attr('class', '').append('svg').attr('id', '').attr('width', this.width).attr('height', height);

      var xAxis = d3.axisBottom(this._x);

      this._displaystartLabel = svg.append("text").attr('class', 'start-label').attr('x', 0).attr('y', height - padding.bottom);

      this._displayendLabel = svg.append("text").attr('class', 'end-label').attr('x', this.width).attr('y', height - padding.bottom).attr('text-anchor', 'end');
      var axis = svg.append('g').attr('class', 'x axis').call(xAxis);

      this._viewport = d3.brushX().extent([[padding.left, 0], [this.width - padding.right, height * 0.51]]).on("brush", function () {
        if (d3.event.selection) {
          _this2._displaystart = d3.format("d")(_this2._x.invert(d3.event.selection[0]));
          _this2._displayend = d3.format("d")(_this2._x.invert(d3.event.selection[1]));
          _this2.dispatchEvent(new CustomEvent("change", {
            detail: {
              displayend: _this2._displayend, displaystart: _this2._displaystart,
              extra: { transform: d3.event.transform }
            }, bubbles: true, cancelable: true
          }));
          _this2._updateLabels();
          _this2._updatePolygon();
        }
      });

      this._brushG = svg.append("g").attr("class", "brush").call(this._viewport);

      this._brushG.call(this._viewport.move, [this._x(this._displaystart), this._x(this._displayend)]);

      this.polygon = svg.append("polygon").attr('class', 'zoom-polygon').attr('fill', '#777').attr('fill-opacity', '0.3');
      this._updateNavRuler();
      window.addEventListener("resize", function (e) {
        _this2.width = _this2.offsetWidth;
        _this2._x = _this2._x.range([padding.left, _this2.width - padding.right]);
        svg.attr('width', _this2.width);
        axis.call(xAxis);
        _this2._updateNavRuler();
      });
    }
  }, {
    key: '_updateNavRuler',
    value: function _updateNavRuler() {
      if (this._x) {
        this._updatePolygon();
        this._updateLabels();
        if (this._brushG) this._brushG.call(this._viewport.move, [this._x(this._displaystart), this._x(this._displayend)]);
      }
    }
  }, {
    key: '_updateLabels',
    value: function _updateLabels() {
      if (this._displaystartLabel) this._displaystartLabel.text(this._displaystart);
      if (this._displayendLabel) this._displayendLabel.text(this._displayend);
    }
  }, {
    key: '_updatePolygon',
    value: function _updatePolygon() {
      if (this.polygon) this.polygon.attr('points', this._x(this._displaystart) + ',' + height / 2 + '\n        ' + this._x(this._displayend) + ',' + height / 2 + '\n        ' + this.width + ',' + height + '\n        0,' + height);
    }
  }, {
    key: 'width',
    get: function get$$1() {
      return this._width;
    },
    set: function set$$1(width) {
      this._width = width;
    }
  }], [{
    key: 'observedAttributes',
    get: function get$$1() {
      return ['length', 'displaystart', 'displayend', 'highlightStart', 'highlightEnd', 'width'];
    }
  }]);
  return ProtVistaNavigation;
}(HTMLElement);

var loadComponent = function loadComponent() {
    customElements.define('protvista-navigation', ProtVistaNavigation$1);
};

// Conditional loading of polyfill
if (window.customElements) {
    loadComponent();
} else {
    document.addEventListener('WebComponentsReady', function () {
        loadComponent();
    });
}

return ProtVistaNavigation$1;

}(d3));
//# sourceMappingURL=protvista-navigation.js.map
