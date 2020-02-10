import React from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { actions, asyncActions } from '../slices';

const mapStateToProps = ({ channels }) => {
  const { byId, currentChannelId } = channels;
  const currentChannel = byId[currentChannelId];
  return { currentChannel };
};

const RenameChannelModal = ({
  currentChannel,
  hideModal,
}) => {
  const { useChannelsActions, useNotificationsActions } = asyncActions;
  const { renameChannel } = useChannelsActions();
  const { showAutoHideNotification } = useNotificationsActions();

  const handleClose = () => {
    hideModal();
  };

  const handleRenameChannel = async ({ newChannelName }) => {
    try {
      await renameChannel(currentChannel.id, newChannelName);
      hideModal();
    } catch (e) {
      showAutoHideNotification({
        text: `An error occurred while renaming the channel #${currentChannel.name}`,
      });
      hideModal();
      throw e;
    }
  };

  return (
    <Modal show onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>{`Rename channel #${currentChannel.name}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          onSubmit={handleRenameChannel}
          initialValues={{ newChannelName: '' }}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            isSubmitting,
          }) => (
            <Form onSubmit={handleSubmit}>
              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  name="newChannelName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.newChannelName}
                  placeholder="New channel name"
                  aria-label="New channel name"
                  aria-describedby="basic-addon2"
                />
                <InputGroup.Append>
                  <Button
                    type="submit"
                    variant="outline-secondary"
                    disabled={isSubmitting}
                  >
                    Rename channel
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Form>
          )}
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default connect(mapStateToProps, actions)(RenameChannelModal);
