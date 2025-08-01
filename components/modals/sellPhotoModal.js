"use client";

import styles from "./sellPhotoModal.module.css";
import Image from "next/image";
import CloseIcon from "@/public/icons/ic_close.svg";
import SearchIcon from "@/public/icons/ic_search.svg";
import Logo from "@/public/assets/logo.svg";

const SellPhotoModal = ({ onClose }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h1 className={styles.myGallery}>마이갤러리</h1>
        <button className={styles.closeButton} onClick={onClose}>
          <Image src={CloseIcon} alt="Close" width={32} height={32} />
        </button>
        <div className={styles.titleArea}>
          <h2 className={styles.titleTxt}>나의 포토카드 판매하기</h2>
        </div>
        <div className={styles.searchArea}>
          <div className={styles.searchWrap}>
            <input
              type="text"
              placeholder="검색"
              className={styles.searchInput}
            />
            <Image
              src={SearchIcon}
              alt="Search"
              className={styles.searchIcon}
              width={24}
              height={24}
            />
          </div>
          <div className={styles.filters}>
            <select className={styles.select}>
              <option>등급</option>
              <option>common</option>
              <option>rare</option>
              <option>super rare</option>
              <option>legendary</option>
            </select>
            <select className={styles.select}>
              <option>장르</option>
              <option>풍경</option>
              <option>인물</option>
              <option>동식물</option>
              <option>사물</option>
            </select>
          </div>
        </div>
        <div className={styles.gridContainer}>
          {[...Array(6)].map((_, idx) => (
            <div className={styles.card} key={idx}>
              <div className={styles.imagePlaceholder} />
              <Image
                src={Logo}
                alt="최애의 포토"
                width={99}
                height={18}
                className={styles.logo}
              />
              <div className={styles.aboutPhoto}>
                <h2>포토카드 이름</h2>
                <p>등급</p>
                <p>장르</p>
                <p>userName</p>
              </div>
              <p>가격</p>
              <p>수량</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellPhotoModal;
