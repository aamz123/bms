class GlobalSettings {
  private static instance: GlobalSettings;

  public isSkipQuadrant1: boolean = false;
  public isSkipQuadrant2: boolean = false;
  public isSkipQuadrant3: boolean = false;
  public isSkipQuadrant4: boolean = false;
  public isSuperCharged: boolean = false; 
  public q1temperature: number= 0.0;
  public q2temperature: number= 0.0;
  public q3temperature: number= 0.0;
  public q4temperature: number= 0.0;


  private constructor() {}

  public static getInstance(): GlobalSettings {
    if (!GlobalSettings.instance) {
      GlobalSettings.instance = new GlobalSettings();
    }
    console.log("Q1 Temperature Updated",GlobalSettings.instance.q1temperature)
    return GlobalSettings.instance;
  }
}

export default GlobalSettings.getInstance();