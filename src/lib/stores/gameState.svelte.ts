import { type Snippet } from 'svelte';

export type ShipType = 'xwing' | 'shuttle';
export type GameStateType = 'menu' | 'playing' | 'dead';
export type CameraView = 'first-person' | 'third-person';
export type FlightMode = 'flying' | 'landing' | 'landed';

class GameState {
    // Ship selection and game state
    selectedShip = $state<ShipType>('xwing');
    state = $state<GameStateType>('menu');
    cameraView = $state<CameraView>('third-person');
    flightMode = $state<FlightMode>('flying');
    
    // Game stats
    score = $state(0);
    health = $state(100);
    fuel = $state(100);
    
    // Position and movement
    position = $state({ x: 0, y: 50, z: 0 });
    rotation = $state({ x: 0, y: 0, z: 0 });
    velocity = $state({ x: 0, y: 0, z: 0 });
    
    // Camera properties
    cameraPosition = $state({ x: 0, y: 55, z: -15 });
    cameraTarget = $state({ x: 0, y: 50, z: 0 });
    
    // Landing gear and thrusters
    landingGearDeployed = $state(false);
    thrusterActive = $state(false);
    isNearMoon = $state(false);
    
    // Methods
    setState(state: GameStateType) {
        this.state = state;
    }
    
    selectShip(ship: ShipType) {
        this.selectedShip = ship;
        this.reset();
    }
    
    toggleCamera() {
        this.cameraView = this.cameraView === 'first-person' ? 'third-person' : 'first-person';
    }
    
    toggleLandingGear() {
        this.landingGearDeployed = !this.landingGearDeployed;
    }
    
    activateThrusters() {
        if (this.fuel > 0) {
            this.thrusterActive = true;
        }
    }
    
    deactivateThrusters() {
        this.thrusterActive = false;
    }
    
    consumeFuel(amount: number) {
        this.fuel = Math.max(0, this.fuel - amount);
        if (this.fuel <= 0) {
            this.thrusterActive = false;
        }
    }
    
    refuel(amount: number) {
        this.fuel = Math.min(100, this.fuel + amount);
    }
    
    reset() {
        this.health = 100;
        this.fuel = 100;
        this.score = 0;
        this.position = { x: 0, y: 50, z: 0 };
        this.rotation = { x: 0, y: 0, z: 0 };
        this.velocity = { x: 0, y: 0, z: 0 };
        this.cameraPosition = { x: 0, y: 55, z: -15 };
        this.cameraTarget = { x: 0, y: 50, z: 0 };
        this.cameraView = 'third-person';
        this.flightMode = 'flying';
        this.isNearMoon = false;
        this.landingGearDeployed = false;
        this.thrusterActive = false;
    }
    
    damage(amount: number) {
        this.health = Math.max(0, this.health - amount);
        if (this.health <= 0) {
            this.state = 'dead';
        }
    }
    
    addScore(points: number) {
        this.score += points;
    }
}

export const gameState = new GameState();