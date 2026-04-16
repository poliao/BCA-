import {
  __commonJS
} from "./chunk-3OV72XIM.js";

// node_modules/guid-typescript/dist/guid.js
var require_guid = __commonJS({
  "node_modules/guid-typescript/dist/guid.js"(exports) {
    exports.__esModule = true;
    var Guid = (
      /** @class */
      function() {
        function Guid2(guid) {
          if (!guid) {
            throw new TypeError("Invalid argument; `value` has no value.");
          }
          this.value = Guid2.EMPTY;
          if (guid && Guid2.isGuid(guid)) {
            this.value = guid;
          }
        }
        Guid2.isGuid = function(guid) {
          var value = guid.toString();
          return guid && (guid instanceof Guid2 || Guid2.validator.test(value));
        };
        Guid2.create = function() {
          return new Guid2([Guid2.gen(2), Guid2.gen(1), Guid2.gen(1), Guid2.gen(1), Guid2.gen(3)].join("-"));
        };
        Guid2.createEmpty = function() {
          return new Guid2("emptyguid");
        };
        Guid2.parse = function(guid) {
          return new Guid2(guid);
        };
        Guid2.raw = function() {
          return [Guid2.gen(2), Guid2.gen(1), Guid2.gen(1), Guid2.gen(1), Guid2.gen(3)].join("-");
        };
        Guid2.gen = function(count) {
          var out = "";
          for (var i = 0; i < count; i++) {
            out += ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
          }
          return out;
        };
        Guid2.prototype.equals = function(other) {
          return Guid2.isGuid(other) && this.value === other.toString();
        };
        Guid2.prototype.isEmpty = function() {
          return this.value === Guid2.EMPTY;
        };
        Guid2.prototype.toString = function() {
          return this.value;
        };
        Guid2.prototype.toJSON = function() {
          return {
            value: this.value
          };
        };
        Guid2.validator = new RegExp("^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$", "i");
        Guid2.EMPTY = "00000000-0000-0000-0000-000000000000";
        return Guid2;
      }()
    );
    exports.Guid = Guid;
  }
});
export default require_guid();
//# sourceMappingURL=guid-typescript.js.map
