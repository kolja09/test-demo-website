import React, { useEffect, useState, useRef } from "react";
import { Layout, Spin, Menu } from "antd";
import axios from "axios";

import {
  TOTAL_PAGE_SIZE_FOR_PRODUCTS,
  TOTAL_PAGE_SIZE_FOR_CATEGORIES,
} from "./consts";
import { ProductTable } from "./components";
import styles from "./App.module.css";

const { Content, Sider } = Layout;

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

const App: React.FC = () => {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [hasMoreCategories, setHasMoreCategories] = useState<boolean>(true);
  const [currentCategoryPage, setCurrentCategoryPage] = useState<number>(1);

  const sidebarRef = useRef<HTMLDivElement>(null);

  const fetchCategories = async (page: number) => {
    if (!hasMoreCategories) return;
    try {
      const categoriesResponse = await axios.get("/categories", {
        params: {
          per_page: TOTAL_PAGE_SIZE_FOR_CATEGORIES,
          page: page,
          sort_by: "created_at",
          sort_order: "desc",
        },
        headers: {
          "X-Api-Key": import.meta.env.VITE_API_KEY,
        },
      });

      const fetchedCategories = categoriesResponse.data.data || [];
      setCategories((prevCategories) => [
        ...prevCategories,
        ...fetchedCategories,
      ]);

      if (page >= categoriesResponse.data.last_page) {
        setHasMoreCategories(false);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async (page: number, categoryId?: number | null) => {
    setLoading(true);
    try {
      const productsResponse = await axios.get("/products", {
        params: {
          per_page: TOTAL_PAGE_SIZE_FOR_PRODUCTS,
          page: page,
          sort_by: "created_at",
          sort_order: "desc",
          ...(categoryId ? { category_id: categoryId } : {}),
        },
        headers: {
          "X-Api-Key": import.meta.env.VITE_API_KEY,
        },
      });
      setProducts(productsResponse.data.data || []);
      setTotalProducts(productsResponse.data.total);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const handleTableChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCategoryScroll = () => {
    const sidebar = sidebarRef.current;
    if (sidebar) {
      const { scrollTop, scrollHeight, clientHeight } = sidebar;
      if (scrollTop + clientHeight >= scrollHeight - 10 && hasMoreCategories) {
        setCurrentCategoryPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    fetchCategories(currentCategoryPage);
  }, [currentCategoryPage]);

  useEffect(() => {
    fetchProducts(currentPage, selectedCategory);
  }, [currentPage, selectedCategory]);

  return (
    <Layout className={styles.layout}>
      <Sider
        width={320}
        className={styles.sidebar}
        ref={sidebarRef}
        onScroll={handleCategoryScroll}
      >
        <Menu mode="inline" selectedKeys={[selectedCategory.toString()]}>
          <Menu.Item
            key="0"
            onClick={() => {
              setSelectedCategory(0);
              setCurrentPage(1);
            }}
            className={!selectedCategory ? styles.activeCategory : ""}
          >
            All categories
          </Menu.Item>

          {categories.map((category) => (
            <Menu.Item
              key={category.id.toString()}
              onClick={() => {
                setSelectedCategory(category.id);
                setCurrentPage(1);
              }}
              className={
                category.id === selectedCategory ? styles.activeCategory : ""
              }
            >
              {category.name}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Content className={styles.content}>
        {loading ? (
          <Spin size="large" className={styles.styledSpin} />
        ) : (
          <ProductTable
            products={products}
            total={totalProducts}
            currentPage={currentPage}
            pageSize={TOTAL_PAGE_SIZE_FOR_PRODUCTS}
            onPageChange={handleTableChange}
          />
        )}
      </Content>
    </Layout>
  );
};

export default App;
