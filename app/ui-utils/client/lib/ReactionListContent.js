import React from 'react';
import { Box, Tag, Modal, ButtonGroup, Button } from '@rocket.chat/fuselage';
import { useMutableCallback } from '@rocket.chat/fuselage-hooks';

import { useTranslation } from '../../../../client/contexts/TranslationContext';
import { useSetting } from '../../../../client/contexts/SettingsContext';
import { useSession } from '../../../../client/contexts/SessionContext';
import Emoji from '../../../../client/components/Emoji';
import ScrollableContentWrapper from '../../../../client/components/ScrollableContentWrapper';
import { openUserCard } from '../../../ui/client/lib/UserCard';
import { openProfileTabOrOpenDM } from '../../../ui/client/views/app/room';

export function Reactions({ reactions, roomInstance, onClose }) {
	const useRealName = useSetting('UI_Use_Real_Name');

	return <ScrollableContentWrapper>
		<Box>
			{Object.entries(reactions).map(([reaction, { names = [], usernames }]) => <Box key={reaction}>
				<Box display='flex' flexWrap='wrap' overflowX='hidden' mb='x8'>
					<Emoji emojiHandle={reaction} />
					<Box paddingBlock='x4' mis='x4'>
						{usernames.map((username, i) => <Username
							key={username}
							displayName={useRealName ? names[i] || username : username}
							username={username}
							roomInstance={roomInstance}
							onClose={onClose}
						/>)}
					</Box>
				</Box>
			</Box>)}
		</Box>
	</ScrollableContentWrapper>;
}

export function Username({ username, displayName, roomInstance, onClose }) {
	const openedRoom = useSession('openedRoom');
	const handleUserCard = useMutableCallback((e) => openUserCard({
		username,
		rid: openedRoom,
		target: e.currentTarget,
		open: (e) => {
			e.preventDefault();
			onClose();
			openProfileTabOrOpenDM(e, roomInstance, username);
		},
	}));

	return (
		<Box marginInlineEnd='x4' onClick={handleUserCard} key={displayName}>
			<Tag>{displayName}</Tag>
		</Box>
	);
}

export default function ReactionListContent({ reactions, roomInstance, onClose }) {
	const t = useTranslation();

	return <>
		<Modal.Header>
			<Modal.Title>{t('Users_reacted')}</Modal.Title>
			<Modal.Close onClick={onClose}/>
		</Modal.Header>
		<Modal.Content fontScale='p1'>
			<Reactions reactions={reactions} roomInstance={roomInstance} onClose={onClose}/>
		</Modal.Content>
		<Modal.Footer>
			<ButtonGroup align='end'>
				<Button primary onClick={onClose}>{t('Ok')}</Button>
			</ButtonGroup>
		</Modal.Footer>
	</>;
}
