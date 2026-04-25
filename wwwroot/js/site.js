// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

function createLoginOverlay() {
    if ($('#login-overlay').length) return;
    const loginHtml = `
    <div id="login-overlay">
        <div id="login-box">
            <h2>Admin Login</h2>
            <div id="login-error"></div>
            <div class="login-field">
                <label for="txtusername">Username</label>
                <input id="txtusername" type="text" autocomplete="username" placeholder="admin" />
            </div>
            <div class="login-field">
                <label for="txtpassword">Password</label>
                <input id="txtpassword" type="password" autocomplete="current-password" placeholder="admin123" />
            </div>
            <button id="btn-login" class="btn btn-primary">Sign In</button>
        </div>
    </div>`;

    $('body').prepend(loginHtml);
    $('body').addClass('login-locked');

    $('#btn-login').on('click', function (e) {
        e.preventDefault();
        const username = $('#txtusername').val().trim();
        const password = $('#txtpassword').val().trim();

        if (username === 'admin' && password === 'admin123') {
            $('#login-overlay').remove();
            $('body').removeClass('login-locked');
            refreshOrderUI();
            removeDriveThruElements();
            return;
        }

        $('#login-error').text('Invalid credentials. Use username admin and password admin123.');
    });

    $('#txtpassword, #txtusername').on('keypress', function (event) {
        if (event.key === 'Enter') {
            $('#btn-login').click();
        }
    });
}

function removeDriveThruElements() {
    const driveRegex = /drive[\s-]*thru/i;
    $('button, input[type="button"], input[type="submit"], a, .btn, .nav-link, .channel-button').filter(function () {
        const text = $(this).text() || '';
        return driveRegex.test(text) || driveRegex.test($(this).attr('id') || '') || driveRegex.test($(this).attr('class') || '');
    }).remove();

    $('*[id], *[class]').filter(function () {
        const id = $(this).attr('id') || '';
        const cls = $(this).attr('class') || '';
        return driveRegex.test(id) || driveRegex.test(cls);
    }).each(function () {
        if ($(this).text().trim().length === 0) {
            $(this).remove();
        }
    });
}

function refreshOrderUI() {
    $('.row .col-md-2 .kds-order, .row .col-md-3 .kds-order2').each(function () {
        const $order = $(this);
        const $thead = $order.find('thead');
        if (!$thead.length) return;

        const $rows = $thead.find('tr');
        if ($rows.length > 1) {
            $rows.last().show();
        }

        const firstRow = $rows.first();
        const lastRow = $rows.last();
        const orderNumber = firstRow.find('td:first-child').text().trim();
        const orderTime = lastRow.find('td:last-child').text().trim() || firstRow.find('td:last-child').text().trim();
        const orderType = lastRow.find('td:first-child').text().trim();

        if (!$order.children('.order-meta-bar').length && (orderNumber || orderType || orderTime)) {
            const metaParts = [];
            if (orderNumber) metaParts.push(`<span class="order-number">${orderNumber}</span>`);
            if (orderType) metaParts.push(`<span class="order-type">${orderType}</span>`);
            if (orderTime) metaParts.push(`<span class="order-time">${orderTime}</span>`);
            const metaHtml = `<div class="order-meta-bar">${metaParts.join('<span class="meta-separator">•</span>')}</div>`;
            $order.prepend(metaHtml);
        }
    });
}

$(document).ready(function () {
    removeDriveThruElements();
    createLoginOverlay();
});
