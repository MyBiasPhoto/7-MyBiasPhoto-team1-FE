"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

import EditPhotoModal from "@/components/modals/editPhotoModal";
import ExchangePhotoModal from "@/components/modals/exchangePhotoModal";
import SellPhotoModal from "@/components/modals/sellPhotoModal";

export default function Home() {
  const [openModal, setOpenModal] = useState(null);
  const SECTION_COUNT = 5;
  const sectionRefs = useRef([]);
  const [current, setCurrent] = useState(0);
  const wheelBlock = useRef(false);

  function handleWheel(e) {
    if (wheelBlock.current) return;

    let next = current;
    if (e.deltaY > 0 && current < SECTION_COUNT - 1) next += 1;
    if (e.deltaY < 0 && current > 0) next -= 1;
    if (next === current) return;

    setCurrent(next);
    wheelBlock.current = true;
    sectionRefs.current[next].scrollIntoView({ behavior: "smooth" });

    setTimeout(() => {
      wheelBlock.current = false;
    }, 600);
  }
  const variants = {
    hidden: { opacity: 0, y: 40, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <main className={styles.main} onWheel={handleWheel}>
      <motion.section
        ref={el => (sectionRefs.current[0] = el)}
        className={styles.section}
        tabIndex={-1}
        initial="hidden"
        animate={current === 0 ? "visible" : "hidden"}
        variants={variants}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className={styles.mainArea}>
          <div className={styles.btnArea}>
            <button className={styles.btn} onClick={() => setOpenModal("edit")}>
              수정 버튼
            </button>
            <button className={styles.btn} onClick={() => setOpenModal("sell")}>
              판매 버튼
            </button>
            <button
              className={styles.btn}
              onClick={() => setOpenModal("exchange")}
            >
              교환 버튼
            </button>
            {openModal === "edit" && (
              <EditPhotoModal onClose={() => setOpenModal(null)} />
            )}
            {openModal === "sell" && (
              <SellPhotoModal onClose={() => setOpenModal(null)} />
            )}
            {openModal === "exchange" && (
              <ExchangePhotoModal onClose={() => setOpenModal(null)} />
            )}
          </div>
          <Image src={"/assets/logo.svg"} alt="로고" width={140} height={25} />
          <span className={styles.title}>
            구하기 어려웠던
            <br />
            <span className={styles.titlePoint}>나의 최애</span>가 여기에!
          </span>
          <Link href="/marketPlace" className={styles.linkBtn}>
            최애 찾으러 가기
          </Link>
        </div>
        <Image
          src="/assets/main-img.svg"
          alt="메인 이미지"
          width={1917}
          height={765}
        />
      </motion.section>

      <motion.section
        ref={el => (sectionRefs.current[1] = el)}
        className={`${styles.section} ${styles.viewSection1}`}
        tabIndex={-1}
        initial="hidden"
        animate={current === 1 ? "visible" : "hidden"}
        variants={variants}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className={styles.topSubArea}>
          <div className={styles.box}>
            <span className={styles.subTitle}>
              포인트로 <span className={styles.topPoint}>안전하게 거래</span>
              하세요
            </span>
            <span className={styles.topText}>
              내 포토카드를 포인트로 팔고, 원하는 포토카드를
              <br />
              포인트로 안전하게 교환하세요
            </span>
          </div>
          <Image
            src="/assets/sub-img1.svg"
            alt="서브 이미지1"
            width={1400}
            height={800}
          />
        </div>
      </motion.section>

      <motion.section
        ref={el => (sectionRefs.current[2] = el)}
        className={`${styles.section} ${styles.viewSection2}`}
        tabIndex={-1}
        initial="hidden"
        animate={current === 2 ? "visible" : "hidden"}
        variants={variants}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className={styles.middleSubArea}>
          <div className={styles.box}>
            <span className={styles.subTitle}>
              알림으로 보다
              <span className={styles.middlePoint}> 빨라진 거래</span>
            </span>
            <span className={styles.middleText}>
              교환 제안부터 판매 완료까지,
              <br />
              실시간 알림으로 놓치지 마세요
            </span>
          </div>
          <div className={styles.imgArea}>
            <div className={styles.speechBubble}>
              <span className={styles.speechBlue}>제 포카랑 교환해요 ✋🏻</span>
              <span className={styles.speechGray}>
                [스페인 여행] 포카 사고 싶어요!
              </span>
            </div>
            <Image
              src="/assets/sub-img2.svg"
              alt="서브 이미지2"
              width={754}
              height={511}
            />
          </div>
        </div>
      </motion.section>

      <motion.section
        ref={el => (sectionRefs.current[3] = el)}
        className={`${styles.section} ${styles.viewSection}`}
        tabIndex={-1}
        initial="hidden"
        animate={current === 3 ? "visible" : "hidden"}
        variants={variants}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className={styles.underSubArea}>
          <div className={styles.box}>
            <span className={styles.subTitle}>
              랜덤 상자로{" "}
              <span className={styles.underPoint}>포인트 받자! 🎉</span>
            </span>
            <span className={styles.underText}>
              한 시간마다 주어지는 랜덤 상자를 열고,
              <br />
              포인트를 획득하세요
            </span>
          </div>
          <Image
            src="/assets/sub-img3.svg"
            alt="서브 이미지3"
            width={1400}
            height={800}
          />
        </div>
      </motion.section>

      <motion.section
        ref={el => (sectionRefs.current[4] = el)}
        className={styles.section}
        tabIndex={-1}
        initial="hidden"
        animate={current === 4 ? "visible" : "hidden"}
        variants={variants}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className={styles.footerSubArea}>
          <Image
            src="/assets/sub-img4.svg"
            alt="서브 이미지4"
            width={300}
            height={450}
          />
          <span className={styles.footerText}>나의 최애를 지금 찾아보세요</span>
          <Link href="/marketPlace" className={styles.linkBtn}>
            최애 찾으러 가기
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
