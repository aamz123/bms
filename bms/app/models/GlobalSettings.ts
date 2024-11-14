class GlobalSettings {
  private static instance: GlobalSettings;

  public isSkipQuadrant1: boolean = false;
  public isSkipQuadrant2: boolean = false;
  public isSkipQuadrant3: boolean = false;
  public isSkipQuadrant4: boolean = false;
  public isSuperCharged: boolean = false; 

  private constructor() {}

  public static getInstance(): GlobalSettings {
    if (!GlobalSettings.instance) {
      GlobalSettings.instance = new GlobalSettings();
    }
    return GlobalSettings.instance;
  }
}

export default GlobalSettings.getInstance();