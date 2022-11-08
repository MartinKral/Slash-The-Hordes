import { Component, instantiate, Node, Prefab } from "cc";

export class ObjectPool<T extends Component> {
    private prefab: Prefab;
    private parent: Node;
    private pooledObjects: PooledObject<T>[] = [];
    private componentType: { new (): T };

    public constructor(prefab: Prefab, parent: Node, defaultPoolCount: number, componentType: { new (): T }) {
        this.prefab = prefab;
        this.parent = parent;
        this.componentType = componentType;

        for (let i = 0; i < defaultPoolCount; i++) {
            this.pooledObjects.push(this.createNew());
        }
    }

    public borrow(): T {
        const objectToBorrow: PooledObject<T> | null = this.pooledObjects.find((o) => !o.IsBorrowed);
        if (objectToBorrow != null) {
            return objectToBorrow.borrow();
        }

        return this.createNew().borrow();
    }

    public return(object: T): void {
        const objectToReturn: PooledObject<T> | null = this.pooledObjects.find((o) => o.Equals(object));
        if (objectToReturn == null) {
            throw new Error("Object " + this.prefab.name + " is not a member of the pool");
        }

        objectToReturn.return();
    }

    private createNew(): PooledObject<T> {
        const newPooledObject: PooledObject<T> = new PooledObject(this.prefab, this.parent, this.componentType);
        this.pooledObjects.push(newPooledObject);

        return newPooledObject;
    }
}

class PooledObject<T extends Component> {
    private isBorrowed = false;
    private defaultParent: Node;
    private instancedNode: Node;
    private instancedComponent: T;

    public constructor(prefab: Prefab, defaultParent: Node, componentType: { new (): T }) {
        this.defaultParent = defaultParent;

        this.instancedNode = instantiate(prefab);
        this.instancedComponent = <T>this.instancedNode.getComponent(componentType.name);
        if (this.instancedComponent == null) {
            throw new Error("Object " + prefab.name + " does not have component " + componentType.name);
        }

        this.clear();
    }

    public get IsBorrowed(): boolean {
        return this.isBorrowed;
    }

    public Equals(component: T): boolean {
        return this.instancedComponent == component;
    }

    public borrow(): T {
        this.isBorrowed = true;
        return this.instancedComponent;
    }

    public return(): void {
        this.clear();
    }

    private clear(): void {
        this.instancedNode.active = false;
        this.instancedNode.parent = this.defaultParent;
        this.isBorrowed = false;
    }
}
