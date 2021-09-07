import React from "react";
import { Table } from "antd";

const TableComp = ({ columns, data }) => {
  return (
    <Table
      pagination={{ position: ["none", "bottomCenter"] }}
      rowKey={data.eventId}
      columns={columns}
      dataSource={data}
      expandable={{
        expandedRowRender: (record) => (
          <p style={{ margin: 0 }}>{record.description}</p>
        ),
        // rowExpandable: (record) => record.name !== "Not Expandable",
      }}
    />
  );
};

export default TableComp;
