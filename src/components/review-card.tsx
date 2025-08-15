import Image from "next/image";
import Link from "next/link";
import { RatingStars } from "@/src/components/rating-stars";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { useState, useEffect } from "react";
import { Notification } from "@/src/components/notification";
import { sanitizeReviewForDisplay } from "@/src/utils/sanitizeReview";
import { useUser } from "@/src/context/userContext";


interface ReviewCardProps {
  review: Review;
  gameId: number;
  isOwnReview?: boolean;
  onEdit?: () => void;
  onDelete?: (reviewId?: number) => void;
  isAdmin?: boolean;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ 
  review, 
  gameId,
  isOwnReview = false, 
  onEdit, 
  onDelete,
  isAdmin = false
}) => {
  const { userRole } = useUser();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [userGameStatus, setUserGameStatus] = useState<UserGameStatus | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [isBanning, setIsBanning] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isReporting, setIsReporting] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Handle private profiles with special cases
  const isPrivateProfile = !review.user.isProfilePublic;
  const canSeeRealName = isOwnReview || userRole === 'ADMIN';
  
  const displayName = (isPrivateProfile && !canSeeRealName)
    ? "Utilizador Anónimo" 
    : (review.user.username || review.user.name || "Utilizador");
  
  const userImage = (isPrivateProfile && !canSeeRealName)
    ? "/placeholder-user.webp" 
    : (review.user.image || "/placeholder-user.webp");
  
  const userProfileUrl = (isPrivateProfile && !canSeeRealName)
    ? "#" 
    : (review.user.username ? `/user/${review.user.username}` : "#");

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(review.id);
    }
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleBanClick = () => {
    setShowBanModal(true);
  };

  const handleConfirmBan = async () => {
    if (!banReason.trim()) return;
    
    setIsBanning(true);
    try {
      const response = await fetch('/api/user/banUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: review.user.id,
          reason: banReason.trim()
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setShowBanModal(false);
        setBanReason("");
        // Optionally refresh the page or show a success message
        window.location.reload();
      } else {
        alert(result.error || "Error banning user");
      }
    } catch (error) {
      console.error("Error banning user:", error);
      alert("Error banning user");
    } finally {
      setIsBanning(false);
    }
  };

  const handleCancelBan = () => {
    setShowBanModal(false);
    setBanReason("");
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleReportClick = () => {
    setShowReportModal(true);
  };

  const handleCancelReport = () => {
    setShowReportModal(false);
    setReportReason("");
    setReportError(null);
    setReportSuccess(false);
  };

  const handleConfirmReport = async () => {
    if (!reportReason.trim()) return;
    setIsReporting(true);
    try {
      const res = await fetch('/api/report/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'REVIEW',
          targetId: review.id,
          reason: reportReason.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setReportError(data?.error || 'Failed to submit report');
        return;
      }
      setReportSuccess(true);
      setReportError(null);
      setReportReason("");
      setShowReportModal(false);
      setToast({ message: 'Report submitted. Thank you for helping keep the community safe.', type: 'success' });
    } catch (e) {
      console.error('Error submitting report:', e);
      setReportError('Error submitting report');
    } finally {
      setIsReporting(false);
    }
  };

  // Buscar o status do jogo para este utilizador
  useEffect(() => {
    const fetchGameStatus = async () => {
      if (!review.user.id) return;
      
      setIsLoadingStatus(true);
      try {
        const response = await fetch(`/api/game/getGameStatus?userId=${review.user.id}&gameId=${gameId}`);
        if (response.ok) {
          const status = await response.json();
          setUserGameStatus(status);
        }
      } catch (error) {
        console.error('Erro ao buscar status do jogo:', error);
      } finally {
        setIsLoadingStatus(false);
      }
    };

    fetchGameStatus();
  }, [review.user.id, gameId]);

  // Função para determinar se o conteúdo deve ser truncado
  const shouldTruncate = (content: string) => {
    const lines = content.split('\n');
    return lines.length > 5 || content.length > 2000;
  };

  // Função para truncar o conteúdo
  const truncateContent = (content: string) => {
    const lines = content.split('\n');
    if (lines.length > 5) {
      return lines.slice(0, 5).join('\n');
    }
    if (content.length > 2000) {
      return content.substring(0, 2000) + '...';
    }
    return content;
  };

  const needsTruncation = review.content && shouldTruncate(review.content);
  const rawDisplayContent = review.content && needsTruncation && !isExpanded 
    ? truncateContent(review.content) 
    : review.content;
  const displayContent = rawDisplayContent ? sanitizeReviewForDisplay(rawDisplayContent) : '';

  return (
    <>
      <div id={`review-${review.id}`} className="group bg-color_sec rounded-xl p-4 sm:p-6 border border-border_detail shadow-lg hover:shadow-xl transition-all duration-200 hover:border-border_detail_sec">
        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="flex-shrink-0">
            {(isPrivateProfile && !canSeeRealName) ? (
              <div className="block">
                <Image
                  src={userImage}
                  alt={`${displayName} avatar`}
                  width={40}
                  height={40}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 ring-border_detail"
                  draggable={false}
                />
              </div>
            ) : (
              <Link href={userProfileUrl} className="block">
                <Image
                  src={userImage}
                  alt={`${displayName} avatar`}
                  width={40}
                  height={40}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 ring-border_detail group-hover:ring-border_detail_sec transition-all duration-200 cursor-pointer hover:scale-105"
                  draggable={false}
                />
              </Link>
            )}

      {toast && (
        <Notification
          message={toast.message}
          type={toast.type}
          position="bottom-right"
          onClose={() => setToast(null)}
        />
      )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-2">
              <div className="flex-1">
                {(isPrivateProfile && !canSeeRealName) ? (
                  <div className="inline-block">
                    <h4 className="font-semibold text-color_text text-base">
                      {displayName}
                      {isOwnReview && (
                        <span className="ml-2 text-xs bg-color_reverse_sec text-color_main px-2 py-1 rounded-full">
                          You
                        </span>
                      )}
                      {isPrivateProfile && userRole === 'ADMIN' && !isOwnReview && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Admin View
                        </span>
                      )}
                    </h4>
                  </div>
                ) : (
                  <Link href={userProfileUrl} className="inline-block">
                    <h4 className="font-semibold text-color_text text-base group-hover:text-color_reverse_sec transition-colors hover:text-color_reverse_sec cursor-pointer">
                      {displayName}
                      {isOwnReview && (
                        <span className="ml-2 text-xs bg-color_reverse_sec text-color_main px-2 py-1 rounded-full">
                          You
                        </span>
                      )}
                      {isPrivateProfile && userRole === 'ADMIN' && !isOwnReview && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Admin View
                        </span>
                      )}
                    </h4>
                  </Link>
                )}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-color_text_sec">
                  <span className="flex items-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatDistanceToNow(new Date(review.createdAt), { 
                      addSuffix: true, 
                      locale: enUS 
                    })}
                  </span>
                  {review.isEdited && (
                    <span className="text-xs text-color_text_sec italic flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      edited
                    </span>
                  )}
                  {userGameStatus && (
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                      <div className="flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg border border-border_detail bg-color_main text-xs font-medium">
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 fill-color_icons" viewBox="0 0 56 56">
                          <path d="m50.923 21.002l.046.131l.171.566l.143.508l.061.232l.1.42a23.933 23.933 0 0 1-2.653 17.167a23.932 23.932 0 0 1-13.57 10.89l-.404.12l-.496.128l-.717.17a1.89 1.89 0 0 1-2.288-1.558a2.127 2.127 0 0 1 1.606-2.389l.577-.145c.36-.094.67-.186.929-.273a19.933 19.933 0 0 0 10.899-8.943a19.934 19.934 0 0 0 2.292-13.923l-.069-.313l-.092-.365l-.115-.418l-.138-.47a2.135 2.135 0 0 1 1.26-2.602a1.894 1.894 0 0 1 2.458 1.067M7.385 19.92a2.127 2.127 0 0 1 1.394 2.63c-.18.606-.31 1.11-.39 1.513a19.933 19.933 0 0 0 2.295 13.91a19.934 19.934 0 0 0 10.911 8.947l.306.097l.174.05l.39.106l.694.171a2.135 2.135 0 0 1 1.623 2.393a1.894 1.894 0 0 1-2.152 1.594l-.138-.025l-.576-.135l-.51-.13l-.446-.125l-.2-.06A23.933 23.933 0 0 1 7.22 39.972a23.932 23.932 0 0 1-2.647-17.197l.077-.32l.1-.375l.194-.665l.076-.25a1.89 1.89 0 0 1 2.365-1.246M28.051 12c8.837 0 16 7.163 16 16s-7.163 16-16 16c-8.836 0-16-7.163-16-16s7.164-16 16-16m0 4c-6.627 0-12 5.373-12 12s5.373 12 12 12c6.628 0 12-5.373 12-12s-5.372-12-12-12m0-12a23.932 23.932 0 0 1 16.217 6.306l.239.227l.275.274l.31.322l.346.369a1.89 1.89 0 0 1-.205 2.76a2.127 2.127 0 0 1-2.873-.196c-.217-.23-.419-.435-.605-.617l-.35-.334l-.16-.143A19.933 19.934 0 0 0 28.051 8a19.934 19.934 0 0 0-13.204 4.976l-.114.102l-.253.24l-.287.285l-.495.515c-.76.809-2.014.9-2.883.21a1.894 1.894 0 0 1-.305-2.662l.09-.106l.405-.431l.368-.378c.175-.175.336-.33.484-.465A23.933 23.933 0 0 1 28.05 4" />
                        </svg>
                        {userGameStatus.status}
                      </div>
                      {userGameStatus.progress && (
                        <div className="flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg border border-border_detail bg-color_main text-xs font-medium">
                          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 fill-color_icons" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                          {userGameStatus.progress}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {(onEdit || onDelete || !isOwnReview) && (
                <div className="flex gap-1 sm:gap-2">
                  {onEdit && (
                    <button
                      onClick={onEdit}
                      className="text-xs text-color_reverse_sec hover:text-color_reverse transition-colors flex items-center gap-1 px-2 sm:px-3 py-1 rounded-lg hover:bg-color_hover"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={handleDeleteClick}
                      className={`text-xs transition-colors flex items-center gap-1 px-2 sm:px-3 py-1 rounded-lg ${
                        isOwnReview 
                          ? "text-red-500 hover:text-red-600 hover:bg-red-100" 
                          : "text-orange-500 hover:text-orange-600 hover:bg-orange-100"
                      }`}
                      title={isOwnReview ? "Delete your review" : "Delete review as administrator"}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span className="hidden sm:inline">{isOwnReview ? "Delete" : "Delete as Admin"}</span>
                    </button>
                  )}
                  {!isOwnReview && (
                    <button
                      onClick={handleReportClick}
                      className="text-xs text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-1 px-2 sm:px-3 py-1 rounded-lg hover:bg-orange-100"
                      title="Report review"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18l7-5 7 5V3L10 8 3 3z" />
                      </svg>
                      <span className="hidden sm:inline">Report</span>
                    </button>
                  )}
                  {!isOwnReview && isAdmin && (
                    <button
                      onClick={handleBanClick}
                      className="text-xs text-red-600 hover:text-red-700 transition-colors flex items-center gap-1 px-2 sm:px-3 py-1 rounded-lg hover:bg-red-100"
                      title="Ban user"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                      </svg>
                      <span className="hidden sm:inline">Ban</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mb-3 sm:mb-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <RatingStars score={review.rating * 20} size={20} />
            <div className="flex items-center gap-1">
              <span className="text-xl sm:text-2xl font-bold text-color_text">
                {review.rating}
              </span>
              <span className="text-base sm:text-lg text-color_text_sec">/5</span>
            </div>
          </div>
        </div>
        
        {review.content && (
          <div className="bg-color_main rounded-lg p-3 sm:p-4 border border-border_detail">
            <div 
              className="text-color_text text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: displayContent }}
            />
            {needsTruncation && (
              <button
                onClick={toggleExpanded}
                className="mt-2 sm:mt-3 text-color_reverse_sec hover:text-color_reverse text-sm font-medium transition-colors flex items-center gap-1"
              >
                {isExpanded ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    Show less
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    Show more
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-color_sec rounded-xl p-6 max-w-md w-full border border-border_detail shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-color_text text-lg">
                  Delete Review
                </h3>
                <p className="text-color_text_sec text-sm">
                  This action cannot be undone
                </p>
              </div>
            </div>
            
            <p className="text-color_text mb-6">
              {isOwnReview 
                ? "Are you sure you want to delete this review? This action is permanent and cannot be undone."
                : "Are you sure you want to delete this review as administrator? This action is permanent and cannot be undone."
              }
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2 border border-border_detail text-color_text rounded-lg hover:bg-color_hover transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Review Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-color_sec rounded-xl p-6 max-w-md w-full border border-border_detail shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full grid place-items-center shrink-0">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M4.93 19h14.14c1.23 0 2-1.33 1.38-2.4L13.38 4.6c-.62-1.07-2.14-1.07-2.76 0L3.55 16.6C2.93 17.67 3.7 19 4.93 19z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-color_text text-lg">Report Review</h3>
                <p className="text-color_text_sec text-sm">Tell us why this review is inappropriate or abusive.</p>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="reportReason" className="block text-sm font-medium text-color_text mb-2">Reason</label>
              <textarea
                id="reportReason"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full px-3 py-2 border border-border_detail rounded-lg bg-color_main text-color_text resize-none"
                placeholder="Describe the issue (e.g., harassment, hate speech, spam, etc.)"
                rows={4}
                maxLength={500}
              />
              <div className="text-xs text-color_text_sec mt-1">{reportReason.length}/500 characters</div>
              {reportError && (
                <div className="mt-2 text-xs text-red-300">{reportError}</div>
              )}
              {reportSuccess && (
                <div className="mt-2 text-xs text-green-300">Report submitted. Thank you for helping keep the community safe.</div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelReport}
                className="flex-1 px-4 py-2 border border-border_detail text-color_text rounded-lg hover:bg-color_hover transition-all duration-200"
                disabled={isReporting}
              >
                {reportSuccess ? 'Close' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmReport}
                disabled={!reportReason.trim() || isReporting}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isReporting ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Reporting...
                  </div>
                ) : (
                  'Submit Report'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ban User Confirmation Modal */}
      {showBanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-color_sec rounded-xl p-6 max-w-md w-full border border-border_detail shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-color_text text-lg">
                  Ban User
                </h3>
                <p className="text-color_text_sec text-sm">
                  This action is permanent
                </p>
              </div>
            </div>
            
            <p className="text-color_text mb-4">
              Are you sure you want to ban the user <strong>{displayName}</strong>? 
              This action will prevent the user from accessing any site functionality.
            </p>

            <div className="mb-4">
              <label htmlFor="banReason" className="block text-sm font-medium text-color_text mb-2">
                Ban reason:
              </label>
              <textarea
                id="banReason"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                className="w-full px-3 py-2 border border-border_detail rounded-lg bg-color_main text-color_text resize-none"
                placeholder="Write the ban reason..."
                rows={3}
                maxLength={500}
              />
              <div className="text-xs text-color_text_sec mt-1">
                {banReason.length}/500 characters
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleCancelBan}
                className="flex-1 px-4 py-2 border border-border_detail text-color_text rounded-lg hover:bg-color_hover transition-all duration-200"
                disabled={isBanning}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBan}
                disabled={!banReason.trim() || isBanning}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBanning ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Banning...
                  </div>
                ) : (
                  "Ban User"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 