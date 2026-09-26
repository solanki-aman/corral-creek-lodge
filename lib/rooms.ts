// Room directory, from the lodge's own directory and property map (supplied by the owner, Sep 2026).
// Floor 1 holds rooms 1–8, floor 2 holds rooms 13–24. Rooms 1–5 are the pet-friendly ground-floor rooms.
export type RoomType='king'|'queen';
export const roomKinds={
 king:{name:'Comfort King Studio',bed:'1 king bed',sleeps:2,rooms:[4,5,8,16,17,20,21,24],image:'king-clean',line:'A little room for two.'},
 queen:{name:'Double Queen Studio',bed:'2 queen beds',sleeps:4,rooms:[1,2,3,6,7,13,14,15,18,19,22,23],image:'queens-clean',line:'Bring your favorite people.'}
} as const;
export const petRooms=[1,2,3,4,5];
export const typeOf=(n:number):RoomType=>(roomKinds.king.rooms as readonly number[]).includes(n)?'king':'queen';
export const ROOM_SIZE='291–301 sq ft';
export const directory={address:'15.5 Mile Mountain 99, Kernville, CA 93238',gps:'35.8587° N, 118.4496° W',rating:'4.7'};
// Map callouts from the directory's property map.
export const places=[
 {n:1,id:'office',label:'Office & check-in',note:'At the room 24 end of the lodge.'},
 {n:2,id:'deck',label:'BBQ deck & patio',note:'Propane grills and picnic tables in the courtyard.'},
 {n:3,id:'entrance',label:'Entrance',note:'Under the Welcome to Corral Creek arch, off Mountain 99.'},
 {n:4,id:'parking',label:'Guest parking',note:'Right in front of the rooms.'},
 {n:5,id:'laundry',label:'Guest laundry',note:'Self-serve, at the far end of the lodge.'}
] as const;
