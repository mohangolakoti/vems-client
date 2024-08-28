import React, { useEffect, useState } from 'react'
import CurrentTime from '../components/CurrentTime'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { dark, light } from '../constants';
import { useTheme } from '../components/ThemeContext';

const SingleMeter = () => {
  const [data, setData] = useState(null);
  const { theme, toggleTheme } = useTheme();
  let {id} = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://vems-api.onrender.com/api/sensordata"
        );
        setData(response.data[0]);
        console.log(response.data[0]);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 1500); // Fetch data every 60 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  const meters = [
    {id:1, name:"VDC Block 2&3 Lighting"},
    {id:2, name:"VDC Block 2&3 AC's"},
    {id:3, name:"Mini Auditorium AC's"},
    {id:4, name:"Sumedha Hostel AC's"},
    {id:5, name:"Sita Auditorium AC's"},
    {id:6, name:"VDC Girls Hostels"},
    {id:7, name:"VDC Block-1 AC's"},
    {id:8, name:"VDC Library AC's"},
    {id:9, name:"SVECW Library AC's"},
    {id:10, name:"CSSD Building"},
    {id:11, name:"Medha Hostel Lighting"},
    {id:12, name:"Geysers"},
    {id:13, name:"Medha Hostel Geysers"},
    {id:14, name:"Hostel Geysers VDC"}
  ]

  return (
    <div className='flex md:flex-row flex-col'>
        <Sidebar/>
      <section className="bg-[#F1F4FC] dark:bg-[#1e1e1e] w-full text-[#1F2937] px-3 h-screen overflow-auto 2xl:px-5">
        <header className="justify-between flex items-center py-2">
        <h1 className="md:text-2xl 2xl:text-5xl text-xl p-4 font-Audiowide font-bold dark:text-[#e4e2e2]">
          Vishnu Energy Monitoring System
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

        <div className='flex flex-col items-center my-10'>
        <h2 className='font-bold text-xl text-center'>{meters.map((m)=><div>{m.id==id?m.name:''}</div>)}</h2>
        <div className='flex gap-4 justify-center text-lg my-10 w-9/12'>
            <div className='border border-black p-4 rounded-xl'>
                <h2 className='font-semibold'>Phase Voltage</h2>
                <p>R - {data?.[`Voltage_V1N_meter_${id}`]}</p>
                <p>Y - {data?.[`Voltage_V2N_meter_${id}`]}</p>
                <p>B - {data?.[`Voltage_V3N_meter_${id}`]}</p>
            </div>
            <div className='border border-black p-4 rounded-xl'>
                <h2 className='font-semibold'>Line Voltage</h2>
                <p>R - {data?.[`Voltage_V12_meter_${id}`]}</p>
                <p>Y - {data?.[`Voltage_V23_meter_${id}`]}</p>
                <p>B - {data?.[`Voltage_V31_meter_${id}`]}</p>
            </div>
            <div className='border border-black p-4 rounded-xl'>
                <h2 className='font-semibold'>Current Phases</h2>
                <p>R - {data?.[`Current_I1_meter_${id}`]}</p>
                <p>Y - {data?.[`Current_I2_meter_${id}`]}</p>
                <p>B - {data?.[`Current_I3_meter_${id}`]}</p>
            </div>
            <div className='border border-black p-4 rounded-xl'>
                <p>KW - {data?.[`Total_KW_meter_${id}`]}</p>
                <p>KVA - {data?.[`Total_KVA_meter_${id}`]}</p>
                <p>KVAR - {data?.[`Total_KVA_meter_${id}`]}</p>
                <p>Power Factor - {data?.[`Avg_PF_meter_${id}`]}</p>
            </div>
            <div className='border border-black p-4 rounded-xl'>
                <p>KWH - {data?.[`TotalNet_KWH_meter_${id}`]}</p>
                <p>KVAH - {data?.[`TotalNet_KVAH_meter_${id}`]}</p>
                <p>KVARH - {data?.[`TotalNet_KVARH_meter_${id}`]}</p>
                <p>Neutral Current - {data?.[`Neutral_Current_meter_${id}`]}</p>
            </div>
            {/* <div className='border border-black p-4 rounded-xl'>
                <p>THD_V1 - {data?.[`THD_V1_meter_${id}`]}</p>
                <p>THD_V2 - {data?.[`THD_V2_meter_${id}`]}</p>
                <p>THD_V3 - {data?.[`THD_V3_meter_${id}`]}</p>
                <p>THD_I1 - {data?.[`THD_I1_meter_${id}`]}</p>
            </div> */}
        </div>
        </div>
        </section>
    </div>
  )
}

export default SingleMeter