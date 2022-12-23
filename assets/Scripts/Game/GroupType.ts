// Flags, shift must match index in ProjectSettings > Physics

export enum GroupType {
    DEFAULT = 1 << 0,
    PLAYER = 1 << 1,
    ENEMY = 1 << 2,
    WEAPON = 1 << 3,
    ITEM = 1 << 4,
    PLAYER_PROJECTILE = 1 << 5,
    ENEMY_PROJECTILE = 1 << 6,
    MAGNET_RANGE = 1 << 7
}
