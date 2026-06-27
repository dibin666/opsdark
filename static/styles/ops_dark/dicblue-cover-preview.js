(function () {
    'use strict';

    if (window.__dicblueCoverPreviewLoaded) {
        return;
    }
    window.__dicblueCoverPreviewLoaded = true;

    var preview;
    var activeImage;
    var activeGroup;

    function getPreview() {
        if (preview) {
            return preview;
        }

        preview = document.createElement('img');
        preview.className = 'dicblue-cover-preview';
        preview.alt = '';
        preview.setAttribute('aria-hidden', 'true');
        document.body.appendChild(preview);
        return preview;
    }

    function updatePreviewPosition() {
        if (!activeImage || !activeGroup || !preview) {
            return;
        }

        var groupRect = activeGroup.getBoundingClientRect();
        var availableLeft = Math.max(0, groupRect.left - 18 - 20);
        var size = Math.min(288, Math.max(90, availableLeft));
        var left = Math.max(18, groupRect.left - size - 20);

        preview.style.width = size + 'px';
        preview.style.height = size + 'px';
        preview.style.left = left + 'px';
        preview.style.top = (groupRect.top + 2) + 'px';
    }

    function showPreview(image) {
        var group = image.closest('.group_image');
        if (!group || !group.closest('.torrent_table')) {
            return;
        }

        activeImage = image;
        activeGroup = group;

        var nextPreview = getPreview();
        var source = image.currentSrc || image.src;
        if (nextPreview.src !== source) {
            nextPreview.src = source;
        }

        updatePreviewPosition();
        nextPreview.classList.add('is-visible');
    }

    function hidePreview() {
        if (preview) {
            preview.classList.remove('is-visible');
        }
        activeImage = null;
        activeGroup = null;
    }

    document.addEventListener('mouseover', function (event) {
        var image = event.target.closest && event.target.closest('.torrent_table .group_image img');
        if (!image || image === activeImage) {
            return;
        }

        showPreview(image);
    });

    document.addEventListener('mouseout', function (event) {
        if (!activeGroup) {
            return;
        }

        var nextTarget = event.relatedTarget;
        if (nextTarget && activeGroup.contains(nextTarget)) {
            return;
        }

        if (event.target.closest && event.target.closest('.group_image') === activeGroup) {
            hidePreview();
        }
    });

    window.addEventListener('scroll', updatePreviewPosition, true);
    window.addEventListener('resize', updatePreviewPosition);
}());
