"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchoolGuard = void 0;
const passport_1 = require("@nestjs/passport");
class SchoolGuard extends (0, passport_1.AuthGuard)('42') {
    constructor() {
        super();
    }
}
exports.SchoolGuard = SchoolGuard;
//# sourceMappingURL=42.guard.js.map