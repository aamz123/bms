import { Battery } from './Battery'; // Assuming Battery class is in another file

// Singleton Pattern to ensure only one instance of the Battery
class BatterySingleton {
  private static instance: Battery;

  private constructor() {} // Private constructor to prevent direct instantiation

  static getInstance(): Battery {
    if (!BatterySingleton.instance) {
      BatterySingleton.instance = new Battery(); // Create the Battery instance if it doesn't exist
    }
    return BatterySingleton.instance; // Return the single instance
  }
}

export const batteryInstance = BatterySingleton.getInstance(); // Expose the singleton instance
