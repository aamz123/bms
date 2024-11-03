import VehicleView from "./components/VehicleView";
import InputView from "./components/InputView";

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl text-center h-[30px]">
        Battery Management System - Team 4
      </h1>
      <div>
        <VehicleView />
        <InputView/>
      </div>
    </div>
  );
}
