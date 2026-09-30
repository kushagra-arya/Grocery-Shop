import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  TrashIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import { toast } from 'react-hot-toast';

export default function ManageContactMessages() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/contact-messages?limit=200');
      const data = res.data?.data || res.data;
      setMessages(data?.messages || []);
    } catch (err) {
      console.error('Failed to load messages:', err);
      toast.error('Failed to load contact messages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRead = async (id) => {
    try {
      const res = await api.put(`/admin/contact-messages/${id}/read`);
      const updated = res.data?.data || res.data;
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isRead: updated.isRead ?? !m.isRead } : m))
      );
    } catch (err) {
      toast.error('Failed to update message');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/contact-messages/${id}`);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setDeleteConfirm(null);
      toast.success('Message deleted');
    } catch (err) {
      toast.error('Failed to delete message');
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      searchQuery === '' ||
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'READ' && msg.isRead) ||
      (filterStatus === 'UNREAD' && !msg.isRead);

    return matchesSearch && matchesStatus;
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-500 text-sm">
            {messages.length} total messages · {unreadCount} unread
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-amazon-orange focus:border-amazon-orange"
            />
          </div>
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-amazon-orange"
            >
              <option value="ALL">All Messages</option>
              <option value="UNREAD">Unread</option>
              <option value="READ">Read</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <EnvelopeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
          <p className="text-gray-500">
            {messages.length === 0
              ? 'No contact messages have been received yet.'
              : 'No messages match your current filters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white rounded-xl shadow-sm border overflow-hidden ${
                !msg.isRead ? 'border-l-4 border-l-amazon-orange' : ''
              }`}
            >
              <div
                className="p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setExpandedId(expandedId === msg.id ? null : msg.id);
                  if (!msg.isRead) handleToggleRead(msg.id);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      {msg.isRead ? (
                        <EnvelopeOpenIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <EnvelopeIcon className="h-5 w-5 text-amazon-orange" />
                      )}
                      <span className={`font-medium ${!msg.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                        {msg.name}
                      </span>
                      <span className="text-sm text-gray-400">&lt;{msg.email}&gt;</span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                        {msg.subject}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate ml-8">
                      {msg.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm(msg.id);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {expandedId === msg.id && (
                <div className="px-4 pb-4 ml-8 border-t pt-3">
                  <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleToggleRead(msg.id)}
                      className="text-xs px-3 py-1.5 border rounded-lg hover:bg-gray-50 text-gray-600"
                    >
                      Mark as {msg.isRead ? 'unread' : 'read'}
                    </button>
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                      className="text-xs px-3 py-1.5 bg-amazon-orange text-white rounded-lg hover:bg-amazon-orange-dark"
                    >
                      Reply via Email
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-6">
            <h3 className="text-lg font-bold mb-2">Delete Message?</h3>
            <p className="text-gray-600 mb-4">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
