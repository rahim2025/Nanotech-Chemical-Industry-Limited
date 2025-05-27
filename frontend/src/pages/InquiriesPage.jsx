import { useEffect, useState } from "react";
import { useInquiryStore } from "../store/useInquiryStore";
import { useAuthStore } from "../store/useAuthStore";
import { 
  Filter, 
  MailOpen, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Mail,
  Check
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const InquiriesPage = () => {
  const { inquiries, isLoading, pagination, getInquiries, updateInquiryStatus } = useInquiryStore();
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedInquiryId, setExpandedInquiryId] = useState(null);

  useEffect(() => {
    // Check if user is admin, if not redirect
    if (authUser && authUser.role !== "admin") {
      navigate("/");
      toast.error("You don't have permission to access this page");
    } else {
      // Load inquiries with filter
      getInquiries(1, statusFilter || undefined);
    }
  }, [authUser, navigate, getInquiries, statusFilter]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric"
    });
  };

  const handleStatusChange = async (inquiryId, status, isResolved) => {
    try {
      await updateInquiryStatus(inquiryId, status, isResolved);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusBadge = (status, isResolved) => {
    if (isResolved) {
      return <span className="badge badge-success gap-1"><Check size={12} /> Resolved</span>;
    }

    switch (status) {
      case "new":
        return <span className="badge badge-info gap-1"><AlertCircle size={12} /> New</span>;
      case "inProgress":
        return <span className="badge badge-warning gap-1"><Clock size={12} /> In Progress</span>;
      case "responded":
        return <span className="badge badge-primary gap-1"><MailOpen size={12} /> Responded</span>;
      case "closed":
        return <span className="badge badge-neutral gap-1"><CheckCircle size={12} /> Closed</span>;
      default:
        return <span className="badge badge-ghost">Unknown</span>;
    }
  };
  const toggleExpandInquiry = (inquiryId) => {
    setExpandedInquiryId(expandedInquiryId === inquiryId ? null : inquiryId);
  };

  return (
    <div className="min-h-screen bg-base-200 pt-20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Product Inquiries</h1>
            <p className="text-base-content/70">Manage customer inquiries about products</p>
          </div>
          
          <div className="flex gap-2">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-outline gap-2">
                <Filter size={16} />
                {statusFilter ? statusFilter : "All Statuses"}
            </label>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><button onClick={() => setStatusFilter("")}>All</button></li>
              <li><button onClick={() => setStatusFilter("new")}>New</button></li>
              <li><button onClick={() => setStatusFilter("inProgress")}>In Progress</button></li>
              <li><button onClick={() => setStatusFilter("responded")}>Responded</button></li>
              <li><button onClick={() => setStatusFilter("closed")}>Closed</button></li>
            </ul>
          </div>
          
          <button 
            className="btn btn-primary gap-2"
            onClick={() => getInquiries(1, statusFilter || undefined)}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : inquiries.length > 0 ? (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div 
              key={inquiry._id}
              className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="card-body p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-primary" />
                      <h3 className="text-lg font-semibold">
                        Pricing Inquiry from {inquiry.name}
                      </h3>
                      {getStatusBadge(inquiry.status, inquiry.isResolved)}
                    </div>
                    <div className="text-sm text-base-content/70">
                      For product: <span className="font-medium">{inquiry.productName}</span>
                    </div>
                  </div>
                  <div className="text-sm text-base-content/60">
                    {formatDate(inquiry.createdAt)}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between gap-2 text-sm">
                  <div>
                    <span className="font-semibold">Email:</span> {inquiry.email}
                    {inquiry.phone && (
                      <span className="ml-4"><span className="font-semibold">Phone:</span> {inquiry.phone}</span>
                    )}
                  </div>
                  
                  <button 
                    className="btn btn-ghost btn-xs gap-1"
                    onClick={() => toggleExpandInquiry(inquiry._id)}
                  >
                    {expandedInquiryId === inquiry._id ? (
                      <>Hide Details <ChevronUp size={14} /></>
                    ) : (
                      <>View Details <ChevronDown size={14} /></>
                    )}
                  </button>
                </div>
                
                {expandedInquiryId === inquiry._id && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Inquiry Details:</h4>
                      <div className="bg-base-200 p-3 rounded-lg whitespace-pre-wrap text-sm">
                        {inquiry.inquiry}
                      </div>
                    </div>
                    
                    <div className="border-t border-base-300 pt-4">
                      <h4 className="font-semibold mb-2">Update Status:</h4>
                      <div className="flex flex-wrap gap-2">
                        <button
                          className={`btn btn-xs ${inquiry.status === 'new' ? 'btn-info' : 'btn-outline'}`}
                          onClick={() => handleStatusChange(inquiry._id, "new", false)}
                        >
                          New
                        </button>
                        <button
                          className={`btn btn-xs ${inquiry.status === 'inProgress' ? 'btn-warning' : 'btn-outline'}`}
                          onClick={() => handleStatusChange(inquiry._id, "inProgress", false)}
                        >
                          In Progress
                        </button>
                        <button
                          className={`btn btn-xs ${inquiry.status === 'responded' ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => handleStatusChange(inquiry._id, "responded", false)}
                        >
                          Responded
                        </button>
                        <button
                          className={`btn btn-xs ${inquiry.status === 'closed' ? 'btn-neutral' : 'btn-outline'}`}
                          onClick={() => handleStatusChange(inquiry._id, "closed", false)}
                        >
                          Closed
                        </button>
                        <button
                          className={`btn btn-xs ${inquiry.isResolved ? 'btn-success' : 'btn-outline'} ml-auto`}
                          onClick={() => handleStatusChange(inquiry._id, inquiry.status, !inquiry.isResolved)}
                        >
                          {inquiry.isResolved ? 'Resolved' : 'Mark as Resolved'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="join">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`join-item btn ${page === pagination.currentPage ? 'btn-active' : ''}`}
                    onClick={() => getInquiries(page, statusFilter || undefined)}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <Mail size={64} className="mx-auto text-base-content/20 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Inquiries Found</h3>
          <p className="text-base-content/60 max-w-md mx-auto">
            {statusFilter 
              ? `No inquiries with status "${statusFilter}" found. Try changing the filter or check back later.` 
              : "You haven't received any product inquiries yet. When customers submit inquiries, they'll appear here."}
          </p>
        </div>
      )}
    </div>
    </div>
  );
};

export default InquiriesPage;
