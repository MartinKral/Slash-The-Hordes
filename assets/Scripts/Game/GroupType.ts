// Flags, shift must match index in ProjectSettings > Physics

export enum GroupType {
    DEFAULT = 1 << 0,
    PLAYER = 1 << 1,
    ENEMY = 1 << 2,
    WEAPON = 1 << 3,
    XP = 1 << 4
}
