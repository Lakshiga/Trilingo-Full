import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface PawLogoProps {
  size?: number;
  color?: string;
}

const PawLogo: React.FC<PawLogoProps> = ({ size = 56, color = '#2E86DE' }) => (
  <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
    {/* Simple paw mark inspired by common paw silhouettes */}
    <Path d="M144 192c-35 0-64-29-64-64s29-64 64-64 64 29 64 64-29 64-64 64z" fill={color}/>
    <Path d="M256 160c-35 0-64-29-64-64s29-64 64-64 64 29 64 64-29 64-64 64z" fill={color}/>
    <Path d="M368 192c-35 0-64-29-64-64s29-64 64-64 64 29 64 64-29 64-64 64z" fill={color}/>
    <Path d="M256 480c-88 0-160-51-160-114 0-48 47-100 116-112 12-2 21-11 24-22 11-40 29-66 20-102-2-10 8-19 18-14 44 22 84 85 84 128 0 12 9 22 21 24 69 12 115 64 115 112 0 63-72 114-160 114z" fill={color}/>
  </Svg>
);

export default PawLogo;


