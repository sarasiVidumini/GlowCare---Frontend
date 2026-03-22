import React from 'react';
import ExpertListModal from './expert/ExpertListModal';
import ExpertFormModal from './expert/ExpertFormModal';
import PrivateChatModal from './expert/PrivateChatModal';
import PrivateMsgEditModal from './expert/PrivateMsgEditModal';

export default function ExpertConsultModals(props) {
    return (
        <>
            <ExpertListModal {...props} />
            <ExpertFormModal {...props} />
            <PrivateChatModal {...props} />
            <PrivateMsgEditModal {...props} />
        </>
    );
}