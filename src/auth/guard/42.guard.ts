import { AuthGuard } from "@nestjs/passport";

export class SchoolGuard extends AuthGuard('42') {
    constructor() {
        super();
    }
}