"use client";
import React, { useState, useEffect, useCallback } from "react";
import css from "@/styles/admin/components/searchbar.module.scss";

interface SearchBarProps {
  filter?: string;
  setFilter?: (filter: string) => void;
  searchText: string;
  setSearchText: (text: string) => void;
  options?: string[];
  border?: string;
  isLoading?: boolean;
  handleSearchChange?: (searchValue: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  filter,
  setFilter,
  searchText,
  setSearchText,
  options,
  border,
  isLoading = false,
  handleSearchChange,
}) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // console.log(e.target.value, "e.target");
    setSearchText(value);
    if (handleSearchChange) {
      handleSearchChange(value);
    }
  };

  return (
    <div
      className={css.searchBar}
      style={{
        border: border ? border : "none",
      }}
    >
      <div className={css.searchIcon}>
        {isLoading ? (
          <div className={css.spinner} />
        ) : (
          <img src="/assets/admin/search.svg" alt="" />
        )}
      </div>
      <input
        type="text"
        placeholder="Search"
        value={searchText}
        onChange={onChange}
        className={css.searchInput}
      />
    </div>
  );
};

export default SearchBar;
