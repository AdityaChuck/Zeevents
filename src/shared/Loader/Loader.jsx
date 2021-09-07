import React from 'react';
import { Row, Spin } from "antd"
import "./Loader.css"
const Loader = () => {
    return (
        <Row justify="center" align="middle" className="loader-contaienr">
            <Spin size="large"  />
        </Row>
    );
};

export default Loader;