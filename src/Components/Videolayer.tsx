import React, {
  useEffect,
  useRef,
} from "react";

import {
  getVideoProgress,
  saveVideoProgress,
  clearVideoProgress,
} from "@/lib/videoProgress";

interface VideolayerProps {
  videoId: string;
  title: string;
  courseId: string;

  // Position requested by Resume Watching button
  resumeRequest?: number;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

/* =====================================================
   EXTRACT YOUTUBE VIDEO ID
   ===================================================== */

const extractYouTubeId = (value: string) => {
  if (!value) return "";

  // Example:
  // dQw4w9WgXcQ
  if (
    !value.includes("/") &&
    !value.includes("?") &&
    !value.includes("=")
  ) {
    return value;
  }

  try {
    const url = new URL(value);

    // https://www.youtube.com/watch?v=XXXX
    if (url.hostname.includes("youtube.com")) {
      return url.searchParams.get("v") || "";
    }

    // https://youtu.be/XXXX
    if (url.hostname === "youtu.be") {
      return url.pathname.substring(1);
    }
  } catch {
    console.error(
      "Unable to extract YouTube video ID:",
      value
    );
  }

  return "";
};

/* =====================================================
   VIDEO PLAYER
   ===================================================== */

const Videolayer: React.FC<VideolayerProps> = ({
  videoId,
  title,
  courseId,
  resumeRequest,
}) => {
  const youtubeVideoId =
    extractYouTubeId(videoId);

  /* YouTube player */
  const playerRef = useRef<any>(null);

  /* Whether YouTube player is ready */
  const playerReadyRef =
    useRef(false);

  /* Resume position waiting to be applied */
  const pendingResumeRef =
    useRef<number | null>(null);

  /* Save progress interval */
  const saveIntervalRef =
    useRef<ReturnType<typeof setInterval> | null>(
      null
    );

  /* Player container */
  const playerContainerRef =
    useRef<HTMLDivElement>(null);

  /* =====================================================
     LOAD YOUTUBE PLAYER
     ===================================================== */

  useEffect(() => {
    if (!youtubeVideoId) {
      console.error(
        "Invalid YouTube video ID:",
        videoId
      );

      return;
    }

    const createPlayer = () => {
      if (!playerContainerRef.current) {
        return;
      }

      if (!window.YT || !window.YT.Player) {
        return;
      }

      /*
       * Prevent creating the player twice
       */
      if (playerRef.current) {
        return;
      }

      console.log(
        "Creating YouTube player:",
        youtubeVideoId
      );

      playerRef.current =
        new window.YT.Player(
          playerContainerRef.current,
          {
            videoId: youtubeVideoId,

            playerVars: {
              autoplay: 0,
              controls: 1,
              rel: 0,
              modestbranding: 1,
            },

            events: {
              /* =========================================
                 PLAYER READY
                 ========================================= */

              onReady: (event: any) => {
                console.log(
                  "YouTube player ready"
                );

                playerReadyRef.current = true;

                /*
                 * Get saved progress
                 */
                const savedTime =
                  getVideoProgress(
                    courseId,
                    youtubeVideoId
                  );

                console.log(
                  "Saved video position:",
                  savedTime
                );

                /*
                 * If Resume Watching was
                 * clicked before player became
                 * ready, use that position.
                 *
                 * Otherwise use saved position.
                 */

                const resumePosition =
                  pendingResumeRef.current !==
                  null
                    ? pendingResumeRef.current
                    : savedTime;

                if (resumePosition > 5) {
                  console.log(
                    "Seeking to:",
                    resumePosition
                  );

                  event.target.seekTo(
                    resumePosition,
                    true
                  );
                }

                /*
                 * Start saving progress
                 * every 5 seconds.
                 */

                if (
                  saveIntervalRef.current
                ) {
                  clearInterval(
                    saveIntervalRef.current
                  );
                }

                saveIntervalRef.current =
                  setInterval(() => {
                    if (
                      playerRef.current &&
                      typeof playerRef.current
                        .getCurrentTime ===
                        "function"
                    ) {
                      const currentTime =
                        playerRef.current.getCurrentTime();

                      if (
                        currentTime > 0
                      ) {
                        saveVideoProgress(
                          courseId,
                          youtubeVideoId,
                          currentTime
                        );
                      }
                    }
                  }, 5000);

                /*
                 * Resume request has now
                 * been handled.
                 */

                pendingResumeRef.current =
                  null;
              },

              /* =========================================
                 VIDEO STATE CHANGES
                 ========================================= */

              onStateChange: (
                event: any
              ) => {
                /*
                 * PAUSED
                 */

                if (
                  event.data ===
                  window.YT.PlayerState
                    .PAUSED
                ) {
                  const currentTime =
                    event.target.getCurrentTime();

                  console.log(
                    "Saving paused position:",
                    currentTime
                  );

                  saveVideoProgress(
                    courseId,
                    youtubeVideoId,
                    currentTime
                  );
                }

                /*
                 * ENDED
                 */

                if (
                  event.data ===
                  window.YT.PlayerState
                    .ENDED
                ) {
                  console.log(
                    "Video completed"
                  );

                  clearVideoProgress(
                    courseId,
                    youtubeVideoId
                  );
                }
              },
            },
          }
        );
    };

    /* =================================================
       YOUTUBE API ALREADY LOADED
       ================================================= */

    if (
      window.YT &&
      window.YT.Player
    ) {
      createPlayer();
    } else {
      /* ===============================================
         LOAD YOUTUBE IFRAME API
         =============================================== */

      const existingScript =
        document.getElementById(
          "youtube-iframe-api"
        );

      if (!existingScript) {
        const script =
          document.createElement(
            "script"
          );

        script.id =
          "youtube-iframe-api";

        script.src =
          "https://www.youtube.com/iframe_api";

        document.body.appendChild(
          script
        );
      }

      /*
       * Tell YouTube what to do when
       * API finishes loading.
       */

      window.onYouTubeIframeAPIReady =
        createPlayer;
    }

    /* =================================================
       CLEANUP
       ================================================= */

    return () => {
      console.log(
        "Cleaning up YouTube player"
      );

      if (
        saveIntervalRef.current
      ) {
        clearInterval(
          saveIntervalRef.current
        );

        saveIntervalRef.current =
          null;
      }

      playerReadyRef.current =
        false;

      if (
        playerRef.current &&
        typeof playerRef.current
          .destroy === "function"
      ) {
        playerRef.current.destroy();
      }

      playerRef.current = null;
    };
  }, [
    courseId,
    youtubeVideoId,
  ]);

  /* =====================================================
     RESUME WATCHING BUTTON
     ===================================================== */

  useEffect(() => {
    if (
      resumeRequest === undefined ||
      resumeRequest <= 0
    ) {
      return;
    }

    console.log(
      "Resume button clicked:",
      resumeRequest
    );

    /*
     * If player isn't ready yet,
     * remember the position.
     */

    if (
      !playerReadyRef.current ||
      !playerRef.current
    ) {
      console.log(
        "Player not ready. Saving pending resume position:",
        resumeRequest
      );

      pendingResumeRef.current =
        resumeRequest;

      return;
    }

    /*
     * Player is ready.
     * Jump to saved position.
     */

    if (
      typeof playerRef.current
        .seekTo === "function"
    ) {
      console.log(
        "Seeking player to:",
        resumeRequest
      );

      playerRef.current.seekTo(
        resumeRequest,
        true
      );

      /*
       * Small delay before play.
       * This makes the seek reliable.
       */

      setTimeout(() => {
        if (
          playerRef.current &&
          typeof playerRef.current
            .playVideo === "function"
        ) {
          playerRef.current.playVideo();
        }
      }, 300);
    }
  }, [resumeRequest]);

  /* =====================================================
     UI
     ===================================================== */

  return (
    <div className="w-full">
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        <div
          ref={playerContainerRef}
          className="absolute inset-0 w-full h-full"
        />
      </div>

      <p className="text-sm text-gray-500 mt-2">
        {title}
      </p>
    </div>
  );
};

export default Videolayer;