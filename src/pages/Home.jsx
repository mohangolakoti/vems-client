import React, { useState, useEffect } from "react";
import axios from "axios";
import CurrentTime from "../components/CurrentTime";
import Loading from '../components/Loading'
import { useTheme } from "../components/ThemeContext";
import { dark, green_fusion, light, vishnu } from "../constants";
import RealTimeEnergyMeter from '../components/charts/RealTimeEnergyMeter';
import { Link } from "react-router-dom";
import { API_URL, API_URL2 } from "../data/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PowerFactorCharts from "../components/charts/PowerFactorCharts";
import PowerLineChart from "../components/charts/PowerLineChart";
import KvaLineChart from '../components/charts/KvaLineChart'
import EnergyUnits from "../components/EnergyUnits";
import EnergyConsumptionChart from "../components/charts/EnergyConsumptionChart";
import RealTimeKvaMeter from "../components/charts/RealTimeKvaMeter";

const Home = () => {
  const [data, setData] = useState(null);
  const { theme, toggleTheme } = useTheme();
  const [currentEnergy, setCurrentEnergy] = useState({
    meter_70: null,
    meter_40: null,
    meter_69: null,
    meter_41: null,
  });
  const [initialEnergyValues, setInitialEnergyValues] = useState({
    meter_70: null,
    meter_40: null,
    meter_69: null,
    meter_41: null,
  });
  const [todayConsumption, setTodayConsumption] = useState({
    meter_70: null,
    meter_40: null,
    meter_69: null,
    meter_41: null,
  });
  const [monthlyEnergy, setMonthlyEnergy] = useState(null)
  const [highestkva, setHighestkva] = useState({
    today:null,
    month:null
  })

  const notify = () => toast.error("Energy limit exceeded!");

  useEffect(() => {
    // Fetch previous day's energy (initial energy)
    const fetchPreviousDayEnergy = async () => {
      try {
        const response = await axios.get(`${API_URL2}/previousDayEnergy`);
        const response1 = await axios.get(`${API_URL2}/monthly-energy`);
        const response3 = await axios.get(`${API_URL2}/highest-kva`);

        setInitialEnergyValues(response.data.initialEnergyValues || {
          meter_70: null,
          meter_40: null,
          meter_69: null,
          meter_41: null,
        });
        setMonthlyEnergy(response1.data.totalEnergyConsumption.toFixed(3))
        setHighestkva({
          today: response3.data.highestKvaToday.toFixed(3),
          month: response3.data.highestKvaMonth.toFixed(3)
        })
      } catch (error) {
        console.error("Error fetching previous day energy:", error);
      }
    };

    fetchPreviousDayEnergy();
  }, []);

  useEffect(() => {
    // Fetch current energy values every minute
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}`);
        const newData = response.data[0];
        setData(newData);
        setCurrentEnergy({
          meter_70: newData.TotalNet_KWH_meter_70,
          meter_40: newData.TotalNet_KWH_meter_40,
          meter_69: newData.TotalNet_KWH_meter_69,
          meter_41: newData.TotalNet_KWH_meter_41,
        });
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Fetch data every 1 minute

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  useEffect(() => {
    // Calculate consumption based on initial energy and current energy
    if (initialEnergyValues && currentEnergy) {
      setTodayConsumption({
        meter_70: initialEnergyValues.meter_70 && currentEnergy.meter_70 ? 
          (currentEnergy.meter_70 - initialEnergyValues.meter_70).toFixed(3) : 0,
        meter_40: initialEnergyValues.meter_40 && currentEnergy.meter_40 ? 
          (currentEnergy.meter_40 - initialEnergyValues.meter_40).toFixed(3) : 0,
        meter_69: initialEnergyValues.meter_69 && currentEnergy.meter_69 ? 
          (currentEnergy.meter_69 - initialEnergyValues.meter_69).toFixed(3) : 0,
        meter_41: initialEnergyValues.meter_41 && currentEnergy.meter_41 ? 
          (currentEnergy.meter_41 - initialEnergyValues.meter_41).toFixed(3) : 0,
      });
    }
  }, [initialEnergyValues, currentEnergy]);

  const energy = (
    Number(todayConsumption.meter_70) + 
    Number(todayConsumption.meter_69) + 
    Number(todayConsumption.meter_40)
  ).toFixed(3);

  const getPFClass = (avgPF) => {
    if (avgPF < 0.7) {
        return 'bg-red-300'; // Class for red background
    } else if (avgPF < 0.8) {
        return 'bg-yellow-300'; // Class for yellow background
    }
    return ''; // No special class
  }

  if (!data) {
    return <div className="flex justify-center items-center w-full"><Loading/></div>;
  }

  return (
    <section className="bg-[#F1F4FC] dark:bg-[#1e1e1e] w-full text-[#1F2937] px-3 h-screen overflow-auto 2xl:px-5">
      <ToastContainer />
      <header className="justify-between flex items-center py-2">
        <h1 className="md:text-2xl 2xl:text-5xl text-xl p-4 flex md:gap-3 font-Audiowide font-bold dark:text-[#e4e2e2]">
        Green Fusion IoT Solutions<img src={green_fusion} className="w-20" alt="" /> 
        </h1> 
        <span className="flex flex-row justify-center items-center">
          <img
            className="w-[30px] h-[30px] cursor-pointer 2xl:w-[42px] 2xl:h-[42px]"
            src={theme === "light" ? dark : light}
            alt="add"
            onClick={toggleTheme}
          />
          <p className="md:text-sm 2xl:text-2xl text-xs text-center px-4 text-gray-500 font-Audiowide font-medium dark:text-[#eae8e8]">
            <CurrentTime />
          </p>
        </span>
      </header>
      <div className="grid lg:grid-cols-2 gap-4 grid-cols-1 mt- 2xl:mt-6">
        <div className="w-full flex flex-col justify-around bg-[#a4a4e3] rounded-lg min-[2000px]:text-4xl xl:text-xl text-lg max-[500px]:text-base font-medium shadow font-OpenSans py-4 px-3 2xl:px-7 max-[500px]:px-0">
          <div className="param-div font-bold font-Montserrat text-lg">
            <h2 className=" value bg-transparent">
              PCC
            </h2>
            <p className="  value bg-transparent pr-2 leading-5">
              Power<p className="text-sm">(kW)</p>
            </p>
            <p className="  value bg-transparent pr-2 leading-5">
              Energy<p className="text-sm">(kWh)</p>
            </p>
            <p className="  value bg-transparent pr-2">
              kVA
            </p>
            <p className="  value bg-transparent leading-5 pr-1">
              Power<p>Factor</p>
            </p>
            <p className="  value bg-transparent pr-5">
              kVAh
            </p>
          </div>
          <div className="param-div">
            <Link to='/pcc1'><h2 className="pccs">
              PCC1
            </h2></Link>
            <p className="value">
              {data?.Total_KW_meter_70.toFixed(2)}
            </p>
            <p className="value">
              {data?.TotalNet_KWH_meter_70.toFixed(1)} {/* {todayConsumption.meter_70} */}
            </p>
            <p className="value">
              {data?.Total_KVA_meter_70.toFixed(2)}
            </p>
            <p className="value">
              {data?.Avg_PF_meter_70.toFixed(2)}
            </p>
            <p className="value">
              {data.TotalNet_KVAH_meter_70.toFixed(1)}
            </p>
          </div>
          
          <div className="param-div">
            <Link to='/pcc2'><h2 className="pccs">
              PCC2
            </h2></Link>
            <p className="value">
                {data?.Total_KW_meter_20.toFixed(2)}
            </p>
            <p className="value">
                {data?.TotalNet_KWH_meter_20.toFixed(1)} {/* {todayConsumption.meter_40} */}
            </p>
            <p className="value">
                {data?.Total_KVA_meter_20.toFixed(2)}
            </p>
            <p className="value">
              {data?.Avg_PF_meter_20.toFixed(3)}
            </p>
            <p className="value">
              {data?.TotalNet_KVAH_meter_20.toFixed(1)}
            </p>
          </div>
          <div className="param-div">
            <Link to='/pcc3'><h2 className="pccs">
              PCC3
            </h2></Link>
            <p className="value">
            {data?.Total_KW_meter_69.toFixed(2)}
            </p>
            <p className="value">
            {data?.TotalNet_KWH_meter_69.toFixed(1)} {/* {todayConsumption.meter_69} */}
            </p>
            <p className="value">
            {data?.Total_KVA_meter_69.toFixed(2)}
            </p>
            <p className={`value ${getPFClass(data?.Avg_PF_meter_69)}`}>
            {data?.Avg_PF_meter_69.toFixed(3)}
            </p>
            <p className="value">
            {data?.TotalNet_KVAH_meter_69.toFixed(1)}
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 grid-cols-1">
          {/* <RealTimeEnergyMeter totalEnergy={data?.TotalNet_KWH_meter_1.toFixed(2)} /> */}
          <EnergyUnits energy={energy} monthlyEnergy={monthlyEnergy} />
          <div className="flex flex-col gap-4">
            <RealTimeKvaMeter kva={(data?.Total_KVA_meter_70 + data?.Total_KVA_meter_20 + data?.Total_KVA_meter_69).toFixed(2)} todayKva={highestkva.today} monthKva = {highestkva.month} />
            {/* <PowerFactorCharts powerFactor={data?.Avg_PF_meter_1.toFixed(3)} />  */}
          </div>
        </div>
      </div>
      <div className="flex md:flex-row gap-4 flex-col h-[44%] mt-4 ">
        <EnergyConsumptionChart/>
        <PowerLineChart/>
        <KvaLineChart/>
      </div>
    </section>
  );
};

export default Home;