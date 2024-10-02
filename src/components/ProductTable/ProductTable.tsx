import React from "react";
import { Table, Button } from "antd";

interface ProductTableProps {
  products: TProduct[];
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  total,
  currentPage,
  pageSize,
  onPageChange,
}) => {
  const onAddToCart = (id: number) => {
    console.log(id);
  };

  const totalPages = Math.ceil(total / pageSize);

  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Short description",
      dataIndex: "short_description",
      key: "short_description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Category",
      key: "categoryName",
      render: (_: unknown, record: TProduct) => (
        <span>{record?.categories?.[0]?.name || "-"}</span>
      ),
    },
    {
      title: "",
      key: "action",
      render: (_: unknown, record: TProduct) => (
        <Button type="primary" onClick={() => onAddToCart(record.id)}>
          Add to Cart
        </Button>
      ),
    },
  ];

  return (
    <Table<TProduct>
      columns={columns}
      dataSource={products}
      rowKey="id"
      pagination={
        totalPages > 1
          ? {
              current: currentPage,
              total: total,
              pageSize: pageSize,
              onChange: onPageChange,
              showSizeChanger: false,
            }
          : false
      }
    />
  );
};
