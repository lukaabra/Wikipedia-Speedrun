import React from 'react';
import Loader from 'react-loader-spinner';

const LoadingComponent = () => (
    <Loader
        type="BallTriangle"
        color="#B4B8AB"
        height={50}
        width={50}
        className="loader"
    />
);

export default LoadingComponent;