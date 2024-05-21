// src/components/SearchAutoComplete.js
import React from 'react';
import { AutoComplete, Input } from 'antd';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { TabsRoutesEnum } from '../../Config/AppRoutesConfig';
import { setActiveTabKey } from '../../store/toolViewer-action';
import './SearchAutoComplete.css'; // 导入 CSS 文件
const SearchAutoComplete = ({ routes }) => {
    console.log("123", routes)
    const history = useHistory();
    const dispatch = useDispatch();



    const renderTitle = (title, path) => (
        <span className="title-text">
            {title}
            <button
                className="more-button" // 应用 CSS 类
                onClick={() => history.push(path)}
            >
                more
            </button>
        </span>
    );


    const renderItem = (title, routePath, tabKey) => ({
        value: tabKey ? `${routePath}:${tabKey}` : routePath,
        label: (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                {title}
                <span>
                    sub page
                </span>
            </div>
        ),
    });



    const options = routes ? Object.values(routes)
        .filter(route => route.title !== TabsRoutesEnum.HOME.label) // 过滤掉 HOME
        .map((route) => {
            console.log("route", route);
            const findItem = Object.values(TabsRoutesEnum).find((item) => item.label === route.title);
            console.log("findItem", findItem);
            const tabs = findItem && findItem.tabs ? Object.values(findItem.tabs).map((tab) =>
                renderItem(tab.label, route.path, tab.key)
            ) : [];
            console.log("tabs", tabs)
            return {
                label: renderTitle(route.title, route.path),
                options: [...tabs],
            };
        }) : [];


    const handleSelect = (value) => {
        const [routePath, tabKey] = value.split(':');
        if (tabKey) {
            history.push(routePath);
            dispatch(setActiveTabKey(tabKey));
        } else {
            history.push(routePath);
        }
    };

    const filterOption = (inputValue, option) => {
        return option.value ? option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1 : false;
    };

    return (
        <AutoComplete
            popupClassName="certain-category-search-dropdown"
            popupMatchSelectWidth={500}
            style={{
                width: 250,
            }}
            options={options}
            onSelect={handleSelect}
            filterOption={filterOption}
        >
            <Input.Search placeholder="Search..." style={{ width: 250 }} />
        </AutoComplete>
    );
};

export default SearchAutoComplete;
