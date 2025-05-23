var _0xd6f9 = [
  "\x75\x73\x65\x20\x73\x74\x72\x69\x63\x74",
  "\x78",
  "\x79",
  "\x77",
  "\x68",
  "\x70\x6F\x69\x6E\x74\x73",
  "\x63\x68\x69\x6C\x64\x72\x65\x6E",
  "\x70\x72\x6F\x74\x6F\x74\x79\x70\x65",
  "\x69\x6E\x73\x65\x72\x74",
  "\x70\x75\x73\x68",
  "\x6C\x65\x6E\x67\x74\x68",
  "\x73\x70\x6C\x69\x74",
  "\x6F\x76\x65\x72\x6C\x61\x70\x73",
  "\x73\x6F\x6D\x65",
  "\x63\x61\x6C\x6C",
  "\x63\x6F\x6E\x74\x61\x69\x6E\x73\x50\x6F\x69\x6E\x74",
  "\x63\x6C\x65\x61\x72",
  "\x72\x6F\x6F\x74",
  "\x6D\x61\x78\x50\x6F\x69\x6E\x74\x73",
];
var PointQuadTree = (function () {
  _0xd6f9[0];
  var _0x559cx2 = 1.1;
  function _0x559cx3(_0x559cx4, _0x559cx5, _0x559cx6, _0x559cx7) {
    this[_0xd6f9[1]] = _0x559cx4;
    this[_0xd6f9[2]] = _0x559cx5;
    this[_0xd6f9[3]] = _0x559cx6;
    this[_0xd6f9[4]] = _0x559cx7;
    this[_0xd6f9[5]] = [];
    this[_0xd6f9[6]] = null;
  }
  _0x559cx3[_0xd6f9[7]] = {
    containsPoint: function (_0x559cx8) {
      return (
        _0x559cx8[_0xd6f9[1]] >= this[_0xd6f9[1]] &&
        _0x559cx8[_0xd6f9[1]] <= this[_0xd6f9[1]] + this[_0xd6f9[3]] &&
        _0x559cx8[_0xd6f9[2]] >= this[_0xd6f9[2]] &&
        _0x559cx8[_0xd6f9[2]] <= this[_0xd6f9[2]] + this[_0xd6f9[4]]
      );
    },
    overlaps: function (_0x559cx9) {
      return (
        _0x559cx9[_0xd6f9[1]] < this[_0xd6f9[1]] + this[_0xd6f9[3]] &&
        _0x559cx9[_0xd6f9[1]] + _0x559cx9[_0xd6f9[3]] > this[_0xd6f9[1]] &&
        _0x559cx9[_0xd6f9[2]] < this[_0xd6f9[2]] + this[_0xd6f9[4]] &&
        _0x559cx9[_0xd6f9[2]] + _0x559cx9[_0xd6f9[4]] > this[_0xd6f9[2]]
      );
    },
    insert: function (_0x559cx8, _0x559cxa) {
      if (this[_0xd6f9[6]] != null) {
        var _0x559cxb =
          _0x559cx8[_0xd6f9[1]] > this[_0xd6f9[1]] + this[_0xd6f9[3]] / 2;
        var _0x559cxc =
          _0x559cx8[_0xd6f9[2]] > this[_0xd6f9[2]] + this[_0xd6f9[4]] / 2;
        this[_0xd6f9[6]][_0x559cxb + _0x559cxc * 2][_0xd6f9[8]](
          _0x559cx8,
          _0x559cxa * _0x559cx2
        );
      } else {
        this[_0xd6f9[5]][_0xd6f9[9]](_0x559cx8);
        if (this[_0xd6f9[5]][_0xd6f9[10]] > _0x559cxa && this[_0xd6f9[3]] > 1) {
          this[_0xd6f9[11]](_0x559cxa);
        }
      }
    },
    some: function (_0x559cx9, _0x559cxd) {
      if (this[_0xd6f9[6]] != null) {
        for (
          var _0x559cxe = 0;
          _0x559cxe < this[_0xd6f9[6]][_0xd6f9[10]];
          ++_0x559cxe
        ) {
          var _0x559cxf = this[_0xd6f9[6]][_0x559cxe];
          if (
            _0x559cxf[_0xd6f9[12]](_0x559cx9) &&
            _0x559cxf[_0xd6f9[13]](_0x559cx9, _0x559cxd)
          ) {
            return true;
          }
        }
      } else {
        for (
          var _0x559cxe = 0;
          _0x559cxe < this[_0xd6f9[5]][_0xd6f9[10]];
          ++_0x559cxe
        ) {
          var _0x559cx8 = this[_0xd6f9[5]][_0x559cxe];
          if (
            _0x559cx3[_0xd6f9[7]][_0xd6f9[15]][_0xd6f9[14]](
              _0x559cx9,
              _0x559cx8
            ) &&
            _0x559cxd(_0x559cx8)
          ) {
            return true;
          }
        }
      }
      return false;
    },
    split: function (_0x559cxa) {
      this[_0xd6f9[6]] = [];
      var _0x559cx10 = this[_0xd6f9[3]] / 2;
      var _0x559cx11 = this[_0xd6f9[4]] / 2;
      for (var _0x559cx5 = 0; _0x559cx5 < 2; ++_0x559cx5) {
        for (var _0x559cx4 = 0; _0x559cx4 < 2; ++_0x559cx4) {
          var _0x559cx12 = this[_0xd6f9[1]] + _0x559cx4 * _0x559cx10;
          var _0x559cx13 = this[_0xd6f9[2]] + _0x559cx5 * _0x559cx11;
          this[_0xd6f9[6]][_0xd6f9[9]](
            new _0x559cx3(_0x559cx12, _0x559cx13, _0x559cx10, _0x559cx11)
          );
        }
      }
      var _0x559cx14 = this[_0xd6f9[5]];
      this[_0xd6f9[5]] = [];
      var _0x559cx15 = this[_0xd6f9[1]] + _0x559cx10;
      var _0x559cx16 = this[_0xd6f9[2]] + _0x559cx11;
      for (
        var _0x559cxe = 0;
        _0x559cxe < _0x559cx14[_0xd6f9[10]];
        ++_0x559cxe
      ) {
        var _0x559cx8 = _0x559cx14[_0x559cxe];
        var _0x559cxb = _0x559cx8[_0xd6f9[1]] > _0x559cx15;
        var _0x559cxc = _0x559cx8[_0xd6f9[2]] > _0x559cx16;
        this[_0xd6f9[6]][_0x559cxb + _0x559cxc * 2][_0xd6f9[8]](
          _0x559cx8,
          _0x559cxa * _0x559cx2
        );
      }
    },
    clear: function () {
      if (this[_0xd6f9[6]] != null) {
        for (var _0x559cxe = 0; _0x559cxe < 4; ++_0x559cxe) {
          this[_0xd6f9[6]][_0x559cxe][_0xd6f9[16]]();
        }
        this[_0xd6f9[6]][_0xd6f9[10]] = 0;
        this[_0xd6f9[6]] = null;
      }
      this[_0xd6f9[5]][_0xd6f9[10]] = 0;
      this[_0xd6f9[5]] = null;
    },
  };
  function PointQuadTree(
    _0x559cx4,
    _0x559cx5,
    _0x559cx6,
    _0x559cx7,
    _0x559cxa
  ) {
    this[_0xd6f9[17]] = new _0x559cx3(
      _0x559cx4,
      _0x559cx5,
      _0x559cx6,
      _0x559cx7
    );
    this[_0xd6f9[18]] = _0x559cxa;
  }
  PointQuadTree[_0xd6f9[7]] = {
    clear: function () {
      this[_0xd6f9[17]][_0xd6f9[16]]();
    },
    insert: function (_0x559cx8) {
      if (!this[_0xd6f9[17]][_0xd6f9[15]](_0x559cx8)) {
        return;
      }
      this[_0xd6f9[17]][_0xd6f9[8]](_0x559cx8, this[_0xd6f9[18]]);
    },
    some: function (_0x559cx9, _0x559cxd) {
      return this[_0xd6f9[17]][_0xd6f9[13]](_0x559cx9, _0x559cxd);
    },
  };
  return PointQuadTree;
})();
