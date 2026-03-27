import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpertListModal from './expert/ExpertListModal';
import ExpertFormModal from './expert/ExpertFormModal';
import PrivateChatModal from './expert/PrivateChatModal';
import PrivateMsgEditModal from './expert/PrivateMsgEditModal';
import { expertService } from '../api/expertService';

export default function ExpertConsultModals(props) {
    const navigate = useNavigate();

    const {
        isDark = true,
        isAdmin = false,
        showExpertsModal = false,
        setShowExpertsModal,
        privateChat = { open: false, messages: [], expert: null, userId: "" },
        setPrivateChat,
        pChatMsg = "",
        setPChatMsg,
        pEditModal = { open: false, id: null, text: "" },
        setPEditModal,
        savePrivateEdit,
        sendPrivateMessage,
        copyMessage,
        openPrivateEdit,
        deletePrivateMsg
    } = props;

    const [experts, setExperts] = useState([]);
    const [expertSearch, setExpertSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [expertEditModal, setExpertEditModal] = useState({
        open: false, id: null, fullName: "", expertiseArea: "", licenseNumber: "", bio: ""
    });

    useEffect(() => {
        if (showExpertsModal) {
            loadExperts();
        }
    }, [showExpertsModal]);

    const loadExperts = async () => {
        setIsLoading(true);
        try {
            const data = await expertService.getAllExperts();
            setExperts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Clinical Database Sync Error:", error);

            // Fix for the Redirect/CORS error: Redirect user to sign-in if token is rejected
            if (error.code === 'ERR_NETWORK' || error.response?.status === 401 || error.response?.status === 403) {
                console.warn("Security rejection. Verifying credentials...");
                // Uncomment if you want to force re-login:
                // navigate('/sign-in');
            }
            setExperts([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveExpert = async (payload) => {
        try {
            if (expertEditModal.id) await expertService.updateExpert(expertEditModal.id, payload);
            else await expertService.createExpert(payload);
            await loadExperts();
            setExpertEditModal({ open: false, id: null, fullName: "", expertiseArea: "", licenseNumber: "", bio: "" });
        } catch (error) {
            alert("Sync Failed.");
        }
    };

    const handleDeleteExpert = async (id) => {
        if (window.confirm("Terminate clinical access?")) {
            try {
                await expertService.deleteExpert(id);
                await loadExperts();
            } catch (error) {
                alert("Action denied.");
            }
        }
    };

    const openPrivateChat = (expert) => {
        setPrivateChat({ ...privateChat, open: true, expert });
        if (setShowExpertsModal) setShowExpertsModal(false);
    };

    const filteredExperts = experts.filter(exp => {
        const query = expertSearch.toLowerCase();
        return exp.fullName?.toLowerCase().includes(query) || exp.expertiseArea?.toLowerCase().includes(query);
    });

    // Handle closing from the /experts page
    const handleClose = () => {
        if (setShowExpertsModal) setShowExpertsModal(false);
        navigate('/timeline'); // Always go back to timeline
    };

    return (
        <>
            <ExpertListModal
                {...props}
                experts={experts}
                isLoading={isLoading}
                filteredExperts={filteredExperts}
                expertSearch={expertSearch}
                setExpertSearch={setExpertSearch}
                openPrivateChat={openPrivateChat}
                deleteExpert={handleDeleteExpert}
                setExpertEditModal={setExpertEditModal}
                onClose={handleClose}
            />

            <ExpertFormModal
                {...props}
                expertEditModal={expertEditModal}
                setExpertEditModal={setExpertEditModal}
                handleSaveExpert={handleSaveExpert}
            />

            <PrivateChatModal
                {...props}
                privateChat={privateChat}
                setPrivateChat={setPrivateChat}
                pChatMsg={pChatMsg}
                setPChatMsg={setPChatMsg}
                sendPrivateMessage={sendPrivateMessage}
                copyMessage={copyMessage}
                openPrivateEdit={openPrivateEdit}
                deletePrivateMsg={deletePrivateMsg}
            />

            <PrivateMsgEditModal
                isDark={isDark}
                pEditModal={pEditModal}
                setPEditModal={setPEditModal}
                savePrivateEdit={savePrivateEdit}
            />
        </>
    );
}