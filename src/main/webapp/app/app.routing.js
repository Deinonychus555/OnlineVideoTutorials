"use strict";
var router_1 = require('@angular/router');
var login_component_1 = require('./components/login/login.component');
var waitingRoom_component_1 = require('./components/waitingRoom/waitingRoom.component');
var room_component_1 = require('./components/room/room.component');
var auth_guard_1 = require('./guards/auth.guard');
var appRoutes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: login_component_1.LoginComponent },
    { path: 'rooms', component: waitingRoom_component_1.WaitingRoomComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: 'room/:roomName', component: room_component_1.RoomComponent, canActivate: [auth_guard_1.AuthGuard] },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map