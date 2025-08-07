"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

import EditPhotoModal from "@/components/modals/editPhotoModal";
import ExchangePhotoModal from "@/components/modals/exchangePhotoModal";
import SellPhotoModal from "@/components/modals/sellPhotoModal";
import LightRays from "@/components/landingPage/LightRays";
import Orb from "@/components/landingPage/Orb";
import Aurora from "@/components/landingPage/Aurora";

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
        ref={(el) => (sectionRefs.current[0] = el)}
        className={styles.section}
        tabIndex={-1}
        initial="hidden"
        animate={current === 0 ? "visible" : "hidden"}
        variants={variants}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className={styles.area}>
          <div className={styles.backArea}>
            <Orb
              hoverIntensity={0}
              rotateOnHover={false}
              hue={325}
              forceHoverState={false}
            />
          </div>
          <div className={styles.content}>
            <Image
              className={styles.hideImg}
              src={"/assets/logo.svg"}
              alt="로고"
              width={140}
              height={25}
            />
            <span className={styles.title}>
              구하기 어려웠던
              <br />
              <span className={styles.titlePoint}>나의 최애</span>가 여기에!
            </span>
            <Link href="/marketPlace" className={styles.linkBtn}>
              최애 찾으러 가기
            </Link>
            <div className={styles.mainImgBox} />
          </div>
        </div>
      </motion.section>

      <motion.section
        ref={(el) => (sectionRefs.current[1] = el)}
        className={`${styles.section} ${styles.viewSection1}`}
        tabIndex={-1}
        initial="hidden"
        animate={current === 1 ? "visible" : "hidden"}
        variants={variants}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className={styles.area}>
          <div className={styles.backArea}>
            <Aurora
              colorStops={["#e9eadc", "#efff04", "#e2db08"]}
              blend={1}
              amplitude={0.5}
              speed={0.8}
            />
          </div>
          <div className={styles.content}>
            <div className={styles.box}>
              <span className={styles.subTitle}>
                포인트로 <span className={styles.topPoint}>안전하게 거래</span>
                하세요
              </span>
              <span className={styles.subText}>
                내 포토카드를 포인트로 팔고, 원하는 포토카드를
                <br />
                포인트로 안전하게 교환하세요
              </span>
            </div>
            <div className={styles.subImg1Box} />
          </div>
        </div>
      </motion.section>

      <motion.section
        ref={(el) => (sectionRefs.current[2] = el)}
        className={`${styles.section} ${styles.viewSection2}`}
        tabIndex={-1}
        initial="hidden"
        animate={current === 2 ? "visible" : "hidden"}
        variants={variants}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className={styles.area}>
          <div className={styles.backArea}>
            <Aurora
              colorStops={["#a4cadb", "#29c9f9", "#0690cb"]}
              blend={1}
              amplitude={0.5}
              speed={0.8}
            />
          </div>
          <div className={styles.content}>
            <div className={styles.box}>
              <span className={styles.subTitle}>
                알림으로 보다
                <span className={styles.middlePoint}> 빨라진 거래</span>
              </span>
              <span className={styles.subText}>
                교환 제안부터 판매 완료까지,
                <br />
                실시간 알림으로 놓치지 마세요
              </span>
            </div>
            <div className={styles.imgArea}>
              <div className={styles.speechArea}>
                <div className={styles.speechBlue}>
                  <span className={styles.blueText}>제 포카랑 교환해요 ✋🏻</span>
                  <div className={styles.polygonBlue} />
                </div>
                <div className={styles.speechGray}>
                  <span className={styles.grayText}>
                    [스페인 여행] 포카 사고 싶어요! 💕
                  </span>
                  <div className={styles.polygonGray} />
                </div>
              </div>
              <div className={styles.subImg2Box} />
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        ref={(el) => (sectionRefs.current[3] = el)}
        className={`${styles.section} ${styles.viewSection}`}
        tabIndex={-1}
        initial="hidden"
        animate={current === 3 ? "visible" : "hidden"}
        variants={variants}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className={styles.area}>
          <div className={styles.backArea}>
            <Aurora
              colorStops={["#FF94B4", "#FF3232", "#71040a"]}
              blend={1}
              amplitude={0.5}
              speed={0.8}
            />
          </div>
          <div className={styles.content}>
            <div className={styles.box}>
              <span className={styles.subTitle}>
                랜덤 상자로{" "}
                <span className={styles.underPoint}>포인트 받자! 🎉</span>
              </span>
              <span className={styles.subText}>
                한 시간마다 주어지는 랜덤 상자를 열고,
                <br />
                포인트를 획득하세요
              </span>
            </div>
            <div className={styles.subImg3Box} />
          </div>
        </div>
      </motion.section>

      <motion.section
        ref={(el) => (sectionRefs.current[4] = el)}
        className={styles.section}
        tabIndex={-1}
        initial="hidden"
        animate={current === 4 ? "visible" : "hidden"}
        variants={variants}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className={styles.area}>
          <div className={styles.backArea}>
            <LightRays
              raysOrigin="top-center"
              raysColor="#ffffff"
              raysSpeed={2.5}
              lightSpread={1}
              rayLength={2.5}
              followMouse={true}
              mouseInfluence={0.5}
              noiseAmount={0.25}
              distortion={0}
              className="custom-rays"
            />
          </div>
          <div className={styles.content}>
            <div className={styles.subImg4Box} />
            <span className={styles.footerText}>
              나의 최애를 지금 찾아보세요
            </span>
            <div className={styles.btnArea}>
              <button
                className={styles.btn}
                onClick={() => setOpenModal("edit")}
              >
                수정 버튼
              </button>
              <button
                className={styles.btn}
                onClick={() => setOpenModal("sell")}
              >
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
            <Link href="/marketPlace" className={styles.linkBtn}>
              최애 찾으러 가기
            </Link>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
