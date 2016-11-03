"use strict";
exports.roomTemplate = "<div id=\"ovt-room\">\n<div class=\"main\">\n    <div class=\"dashboard\">\n        <ovt-participant *ngIf=\"mainUser.userName\" [id]=\"mainUser.userName\" [ngClass]=\"{'mainParticipant':mainUser}\" [name]=\"mainUser.name\" [userType]=\"mainUser.userType\" [roomName]=\"name\"></ovt-participant>\n        <div><!--ovt-file--></div>\n    </div>\n    \n    <ovt-chat class=\"chat\" [address]=\"address\"></ovt-chat>\n    \n</div>\n<div class=\"secundary\">\n    <ovt-participant [id]=\"user.userName\" [ngClass]=\"{'tutor':user.isATutor(), 'student':user.isAStudent()}\" [name]=\"user.name\" [userType]=\"user.userType\" [roomName]=\"name\" *ngFor=\"let user of users\"></ovt-participant>\n</div>\n<button name=\"exitRoom\" (click)=\"onExitOfRoom()\">Exit</button>\n</div>";
//# sourceMappingURL=room.html.js.map