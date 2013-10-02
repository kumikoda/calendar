var Interval, Node, Tree, flatten, median, prettyPrint, spaces;

Tree = (function() {
  function Tree(intervals) {
    this.intervals = intervals;
    this.root = new Node(this.intervals);
  }

  Tree.prototype.search = function(value) {
    return this.root.search(value);
  };

  Tree.prototype.overlap = function(interval) {
    return flatten(this.root.search(interval.values[0], this.root.search(interval.values[1])));
  };

  Tree.prototype.print = function() {
    return this.root.print(0);
  };

  Tree.prototype.findAllOverlaps = function() {
    var i, overlaps, _i, _len, _ref, _results;
    _ref = this.intervals;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      overlaps = this.overlap(i);
      _results.push(i.overlaps = overlaps);
    }
    return _results;
  };

  Tree.prototype.findAllPositions = function() {
    var i, o, smaller, _i, _len, _ref, _results;
    _ref = this.intervals;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      smaller = (function() {
        var _j, _len1, _ref1, _results1;
        _ref1 = i.overlaps;
        _results1 = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          o = _ref1[_j];
          if (o.values[0] < i.values[0]) {
            _results1.push(o);
          }
        }
        return _results1;
      })();
      _results.push(i.smaller = smaller.length);
    }
    return _results;
  };

  return Tree;

})();

Node = (function() {
  function Node(intervals) {
    var interval, leftNodes, rightNodes,
      _this = this;
    if (intervals.length === 1) {
      this.intervals = intervals;
    } else if (intervals.length > 1) {
      this.center = median(flatten((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = intervals.length; _i < _len; _i++) {
          interval = intervals[_i];
          _results.push(interval.values);
        }
        return _results;
      })()));
      this.intervals = intervals.filter(function(d) {
        return d.contains(_this.center);
      });
      leftNodes = intervals.filter(function(d) {
        return d.left(_this.center);
      });
      if (leftNodes.length) {
        this.left = new Node(leftNodes);
      }
      rightNodes = intervals.filter(function(d) {
        return d.right(_this.center);
      });
      if (rightNodes.length) {
        this.right = new Node(rightNodes);
      }
    }
  }

  Node.prototype.search = function(value) {
    var i, results, _i, _len, _ref;
    results = [];
    _ref = this.intervals;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      if (i.contains(value)) {
        results.push(i);
      }
    }
    if (value < this.center && this.left) {
      results = results.concat(this.left.search(value));
    } else if (value > this.center && this.right) {
      results = results.concat(this.right.search(value));
    }
    return results;
  };

  Node.prototype.print = function(level) {
    var interval;
    console.log(spaces(level) + ((function() {
      var _i, _len, _ref, _results;
      _ref = this.intervals;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        interval = _ref[_i];
        _results.push(interval.values);
      }
      return _results;
    }).call(this)));
    if (this.left) {
      this.left.print(level + 1);
    }
    if (this.right) {
      return this.right.print(level + 1);
    }
  };

  return Node;

})();

Interval = (function() {
  function Interval(values) {
    this.values = values;
  }

  Interval.prototype.contains = function(value) {
    return (this.values[0] <= value && value <= this.values[1]);
  };

  Interval.prototype.right = function(value) {
    return this.values[0] > value;
  };

  Interval.prototype.left = function(value) {
    return this.values[1] < value;
  };

  return Interval;

})();

flatten = function(a) {
  return [].concat.apply([], a);
};

median = function(values) {
  var half;
  values.sort(function(a, b) {
    return a - b;
  });
  half = Math.floor(values.length / 2);
  return values[half];
};

spaces = function(n) {
  var i, result, _i;
  result = '';
  for (i = _i = 0; 0 <= n ? _i < n : _i > n; i = 0 <= n ? ++_i : --_i) {
    result = result.concat('=');
  }
  return result;
};

prettyPrint = function(intervals) {
  var i, _i, _len, _results;
  _results = [];
  for (_i = 0, _len = intervals.length; _i < _len; _i++) {
    i = intervals[_i];
    _results.push(console.log(i.values));
  }
  return _results;
};
