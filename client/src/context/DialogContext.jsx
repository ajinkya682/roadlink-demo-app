import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DialogContext = createContext({});

export const useDialog = () => useContext(DialogContext);

export const DialogProvider = ({ children }) => {
  const [dialogConfig, setDialogConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'alert', // 'alert' or 'confirm'
    onConfirm: null,
    onCancel: null,
  });

  const showAlert = useCallback((title, message) => {
    setDialogConfig({
      isOpen: true,
      title,
      message,
      type: 'alert',
      onConfirm: () => closeDialog(),
      onCancel: null,
    });
  }, []);

  const showConfirm = useCallback((title, message) => {
    return new Promise((resolve) => {
      setDialogConfig({
        isOpen: true,
        title,
        message,
        type: 'confirm',
        onConfirm: () => {
          closeDialog();
          resolve(true);
        },
        onCancel: () => {
          closeDialog();
          resolve(false);
        },
      });
    });
  }, []);

  const closeDialog = useCallback(() => {
    setDialogConfig((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      <AnimatePresence>
        {dialogConfig.isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={dialogConfig.type === 'alert' ? dialogConfig.onConfirm : dialogConfig.onCancel}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm relative z-10 shadow-xl"
            >
              <h3 className="font-display text-lg font-bold text-on-surface mb-2">
                {dialogConfig.title}
              </h3>
              <p className="font-body text-sm text-on-surface-muted mb-6">
                {dialogConfig.message}
              </p>
              
              <div className="flex gap-3 justify-end">
                {dialogConfig.type === 'confirm' && (
                  <button
                    onClick={dialogConfig.onCancel}
                    className="px-4 py-2 rounded-xl font-body text-sm font-semibold text-on-surface-muted hover:bg-surface-low transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={dialogConfig.onConfirm}
                  className="px-5 py-2 rounded-xl font-body text-sm font-semibold bg-navy text-white hover:bg-navy/90 transition-colors"
                >
                  {dialogConfig.type === 'confirm' ? 'Confirm' : 'OK'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DialogContext.Provider>
  );
};
