import { useState, useEffect } from 'react';
import {
    SearchIcon,
    ArrowDownIcon,
    ArrowUpIcon,
} from '@heroicons/react/outline';
import background, { gradient } from './background';
import { shuffle } from 'lodash';
import styled, { keyframes } from 'styled-components';

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const GradientBackground = styled.div`
  background: ${({ gradient }) => gradient || 'none'};
  background-size: 200% 200%;
  animation: ${gradientAnimation} 10s ease infinite;
`;

export default function App() {
    const [search, setSearch] = useState('');
    const [info, setInfo] = useState({});
    const [grad, setgrad] = useState(null);

    async function getData() {
        if (!search) {
            console.log('Search value is empty');
            return;
        }

        await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=ca6af22a7c8f480eab5140733241501&q=${search}&days=1&aqi=no&alerts=no`
        )
            .then((r) => r.json())
            .then((d) => {
                if (d.error) {
                    console.error('API Error:', d.error);
                    return;
                }

                console.log('Full response:', d); // Log the full response
                setInfo({
                    name: d.location.name,
                    country: d.location.country,
                    condition: d.current.condition.text,
                    temp: {
                        current: d.current.temp_c,
                        max: d.forecast.forecastday[0].day.maxtemp_c,
                        min: d.forecast.forecastday[0].day.mintemp_c,
                    },
                });
                console.log('Available info:', {
                    name: d.location.name,
                    country: d.location.country,
                    condition: d.current.condition.text,
                    temp: {
                        current: d.current.temp_c,
                        max: d.forecast.forecastday[0].day.maxtemp_c,
                        min: d.forecast.forecastday[0].day.mintemp_c,
                    },
                }); // Log the available info
            })
            .catch((error) => {
                console.error('Fetch error:', error);
            });
    }

    function handleButtonClick() {
        getData();
    }
    function handleKeyPress(e) {
        if (e.key === 'Enter') handleButtonClick();
    }

    function handleSearch(e) {
        setSearch(e.target.value);
    }
    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        setgrad(shuffle(gradient).pop());
    }, []);

    return (
        <GradientBackground
            gradient={grad}
            style={
                info.condition?.toLowerCase() === 'clear'
                    ? { backgroundImage: background.clear }
                    : info.condition?.toLowerCase() === 'sunny'
                    ? { backgroundImage: background.sunny }
                    : info.condition?.toLowerCase().includes('cloudy')
                    ? { backgroundImage: background.cloudy }
                    : info.condition?.toLowerCase().includes('rain') ||
                      info.condition?.toLowerCase().includes('drizzle')
                    ? { backgroundImage: background.rainy }
                    : info.condition?.toLowerCase().includes('snow') ||
                      info.condition?.toLowerCase().includes('sleet')
                    ? { backgroundImage: background.snow }
                    : info.condition?.toLowerCase().includes('overcast')
                    ? { backgroundImage: background.overcast }
                    : { backgroundImage: grad }
            }
            className='flex flex-row text-black items-center justify-center h-screen bg-center bg-cover select-none'
        >
            <div className='flex flex-row h-16 sm:h-24 absolute'>
                <input
                    className='bg-transparent placeholder:text-black text-lg focus:outline-none border-transparent focus:border-transparent focus:ring-0 sm:text-xl font-light self-end mb-1 mr-10'
                    type='text'
                    spellCheck='false'
                    value={search}
                    placeholder='please enter location'
                    onChange={handleSearch}
                    onFocus={(e) => (e.target.placeholder = '')}
                    onBlur={(e) =>
                        (e.target.placeholder = 'please enter location')
                    }
                    onKeyPress={handleKeyPress}
                />

                <div className='self-end mb-1  '>
                    <SearchIcon
                        className='cursor-pointer h-6 sm:h-7 opacity-70'
                        onClick={handleButtonClick}
                    />
                </div>
            </div>

            <div className='grid overflow-hidden grid-cols-2 grid-rows-2 gap-10 sm:gap-40 sm:mt-72 mt-56 sm:mr-0 mr-4'>
                <div className='row-span-2 justify-self-end'>
                    {info.temp ? (
                        <p className='text-end sm:text-9xl text-7xl font-light tracking-tighter'>
                            {info.temp?.current}
                            <span className=' align-top  text-lg sm:font-light font-normal sm:text-3xl'>
                                °
                            </span>
                        </p>
                    ) : null}
                </div>
                <div className='row-span-2  sm:mt-3 mt-2  justify-self-start truncate'>
                    <p className=' text-start sm:text-3xl font-light sm:pb-1 sm:ml-1'>
                        {info.condition}
                    </p>
                    {info.temp ? (
                        <p className='sm:text-2xl  text-start font-light'>
                            <ArrowUpIcon className='sm:h-4  h-2 inline-flex align-middle' />
                            {info.temp?.max}
                            <span className='align-top font-normal sm:text-base text-xs'>
                                °
                            </span>{' '}
                            <ArrowDownIcon className='sm:h-4 h-2 inline-flex align-middle' />
                            {info.temp?.min}
                            <span className='align-top font-normal sm:text-base text-xs'>
                                °
                            </span>
                        </p>
                    ) : null}

                    <p className='sm:text-xl text-xs  text-start font-light  whitespace-nowrap  sm:mt-1 sm:ml-1'>
                        {info.country}
                    </p>
                </div>
            </div>
        </GradientBackground>
    );
}
