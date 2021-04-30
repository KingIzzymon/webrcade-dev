import React, { Component } from "react";
import { AppRegistry } from '../../../apps';
import { GamepadNotifier, FocusGrid } from "../../../input"
import AppDetails from "./app-details";
import AppCategory from "./app-category";
import Logo from "../../common/logo";
import Slider from "../../common/slider";
import ImageButton from "../../common/image-button";

import PlayImageWhite from "../../../images/play-white.svg"
import PlayImageBlack from "../../../images/play-black.svg"

require("./style.scss");

export default class AppBrowseScreen extends Component {

  constructor() {
    super();

    this.state = {
      category: null,
      currentItem: null,
      menuMode: AppBrowseScreen.ModeEnum.CATEGORIES
    };

    this.sliderRef = React.createRef();
    this.playButtonRef = React.createRef();
    this.categoryRef = React.createRef();
    this.appRef = React.createRef();

    this.focusGrid.setComponents([
      [this.playButtonRef],
      [this.categoryRef],
      [this.sliderRef]
    ]);
  }

  static ModeEnum = {
    APPS: "apps",
    CATEGORIES: "categories"
  }

  MAX_SLIDES = 8;

  focusGrid = new FocusGrid();

  gamepadCallback = e => {
    const { focusGrid } = this;

    focusGrid.focus();
    return true;
  }

  focus() {
    const { sliderRef } = this;
    sliderRef.current.focus();
  }

  startGamepadNotifier() {
    // Start the gamepad notifier 
    GamepadNotifier.instance.start();
    GamepadNotifier.instance.setDefaultCallback(this.gamepadCallback);
  }

  stopGamepadNotifier() {
    // Stop the gamepad notifier
    GamepadNotifier.instance.stop();
    GamepadNotifier.instance.setDefaultCallback(null);
  }

  componentDidMount() {
    this.startGamepadNotifier();
  }

  componentWillUnmount() {
    this.stopGamepadNotifier();
  }

  componentDidUpdate(prevProps, prevState) {
    const { hide } = this.props;

    if (hide) {
      this.stopGamepadNotifier();
    } else {
      this.startGamepadNotifier();
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { ModeEnum } = AppBrowseScreen;

    if (!state || props.feed !== state.feed) {
      console.log('feed has changed');
      const feed = props.feed;
      if (feed) {
        const category = feed.getCategories()[0];
        const isCategories = feed.getUniqueCategoryCount() > 1;
        return {
          feed: feed,
          category: category,
          currentItem: isCategories ? category : category.items[0],
          menuMode: isCategories ? ModeEnum.CATEGORIES : ModeEnum.APPS
        }
      }
    }
    return null;
  }

  getCategoryTitle(item) {
    return item.longTitle ? item.longTitle : item.title;
  }

  render() {
    const { hide, onAppSelected } = this.props;
    const { category, currentItem, menuMode, feed } = this.state;
    const { focusGrid, playButtonRef, sliderRef, categoryRef, MAX_SLIDES } = this;
    const { ModeEnum } = AppBrowseScreen;

    const reg = AppRegistry.instance;
    const isCategories = (menuMode === ModeEnum.CATEGORIES);
    const items = isCategories ? feed.getCategories() : category.items;

    let title = '', backgroundSrc = null, description = null, subTitle = null,
      categoryLabel = null, getTitle = null, getThumbnailSrc, onClick = null;

    if (currentItem) {
      if (isCategories) {
        title = this.getCategoryTitle(currentItem);
        backgroundSrc = currentItem.background; /* TODO: Default */
        description = currentItem.description;
        categoryLabel = "Categories";
        getTitle = item => item.title;
        getThumbnailSrc = item => item.thumbnail ? item.thumbnail : 'images/apps/folder.png';
        onClick = () => {
          this.setState({
            menuMode: ModeEnum.APPS,
            category: currentItem,
            currentItem: currentItem.items[0],
          });
          sliderRef.current.focus();
        }
      } else {
        title = reg.getLongTitle(currentItem);
        backgroundSrc = reg.getBackground(currentItem);
        description = reg.getDescription(currentItem);
        subTitle = reg.getName(currentItem);
        categoryLabel = this.getCategoryTitle(category);
        getTitle = item => reg.getTitle(item);
        getThumbnailSrc = item => reg.getThumbnail(item);
        onClick = () => { if (onAppSelected) onAppSelected(currentItem); }
      }
    }

    return (
      <div className="webrcade">
        <div className={'webrcade-outer' +
          (hide === true ? ' webrcade-outer--hide' : '')}>
          <Logo />
          <AppDetails
            title={title}
            description={description}
            subTitle={subTitle}
            backgroundSrc={backgroundSrc}
            buttons={currentItem ?
              <ImageButton
                onPad={e => focusGrid.moveFocus(e.type, playButtonRef)}
                onClick={onClick}
                ref={playButtonRef}
                imgSrc={!isCategories ? PlayImageBlack : null}
                hoverImgSrc={!isCategories ? PlayImageWhite : null}
                label={isCategories ? "SELECT" : "PLAY"}
              /> : null
            }
            bottom={
              <AppCategory
                isSelectable={!isCategories && feed.getUniqueCategoryCount() > 1}
                onPad={e => focusGrid.moveFocus(e.type, categoryRef)}
                ref={categoryRef}
                label={categoryLabel}
                onClick={() => {
                  this.setState({ menuMode: ModeEnum.CATEGORIES });
                  sliderRef.current.focus();
                }}
              />
            }
          />
          <Slider
            maxSlides={MAX_SLIDES}
            onPad={e => focusGrid.moveFocus(e.type, sliderRef)}
            items={items}
            ref={sliderRef}
            getTitle={getTitle}
            getThumbnailSrc={getThumbnailSrc}
            onSelected={item => this.setState({ currentItem: item })}
            onClick={() => playButtonRef.current.focus()} />
        </div>
      </div>
    );
  }
};
